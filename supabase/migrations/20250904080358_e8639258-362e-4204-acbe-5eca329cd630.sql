-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('user', 'designer', 'manager', 'admin', 'super_admin');

-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create template categories table
CREATE TABLE public.template_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create templates table
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.template_categories(id),
  thumbnail_url TEXT,
  template_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'archived')),
  version INTEGER NOT NULL DEFAULT 1,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  published_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create template versions table for version control
CREATE TABLE public.template_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  template_data JSONB NOT NULL,
  change_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create template usage analytics table
CREATE TABLE public.template_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ad_id UUID REFERENCES public.ads(id)
);

-- Create audit log table for tracking changes
CREATE TABLE public.admin_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET
);

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Function to check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = is_admin.user_id
      AND role IN ('admin', 'super_admin')
      AND is_active = true
  )
$$;

-- Function to check if user has manager or higher role
CREATE OR REPLACE FUNCTION public.is_manager_or_above(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = is_manager_or_above.user_id
      AND role IN ('manager', 'admin', 'super_admin')
      AND is_active = true
  )
$$;

-- Function to check if user has designer or higher role
CREATE OR REPLACE FUNCTION public.is_designer_or_above(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = is_designer_or_above.user_id
      AND role IN ('designer', 'manager', 'admin', 'super_admin')
      AND is_active = true
  )
$$;

-- RLS Policies for admin_users
CREATE POLICY "Admin users can view all admin users"
ON public.admin_users
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Super admins can manage admin users"
ON public.admin_users
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
  )
);

-- RLS Policies for template_categories
CREATE POLICY "Anyone can view published categories"
ON public.template_categories
FOR SELECT
USING (true);

CREATE POLICY "Managers can manage categories"
ON public.template_categories
FOR ALL
USING (public.is_manager_or_above());

-- RLS Policies for templates
CREATE POLICY "Anyone can view published templates"
ON public.templates
FOR SELECT
USING (status = 'published');

CREATE POLICY "Designers can view and create templates"
ON public.templates
FOR SELECT
USING (public.is_designer_or_above());

CREATE POLICY "Designers can create templates"
ON public.templates
FOR INSERT
WITH CHECK (public.is_designer_or_above());

CREATE POLICY "Designers can update their own templates"
ON public.templates
FOR UPDATE
USING (created_by = auth.uid() AND public.is_designer_or_above());

CREATE POLICY "Managers can update any template"
ON public.templates
FOR UPDATE
USING (public.is_manager_or_above());

CREATE POLICY "Managers can delete templates"
ON public.templates
FOR DELETE
USING (public.is_manager_or_above());

-- RLS Policies for template_versions
CREATE POLICY "Designers can view template versions"
ON public.template_versions
FOR SELECT
USING (public.is_designer_or_above());

CREATE POLICY "System can insert template versions"
ON public.template_versions
FOR INSERT
WITH CHECK (public.is_designer_or_above());

-- RLS Policies for template_usage
CREATE POLICY "Admins can view template usage"
ON public.template_usage
FOR SELECT
USING (public.is_admin());

CREATE POLICY "System can track template usage"
ON public.template_usage
FOR INSERT
WITH CHECK (true);

-- RLS Policies for admin_audit_log
CREATE POLICY "Admins can view audit log"
ON public.admin_audit_log
FOR SELECT
USING (public.is_admin());

CREATE POLICY "System can insert audit log"
ON public.admin_audit_log
FOR INSERT
WITH CHECK (true);

-- Insert default template categories
INSERT INTO public.template_categories (name, description, icon) VALUES
('Business', 'Professional business advertisements', 'Briefcase'),
('Food & Restaurant', 'Restaurant and food service ads', 'UtensilsCrossed'),
('Fashion & Beauty', 'Fashion, beauty and lifestyle ads', 'Shirt'),
('Technology', 'Tech products and services', 'Smartphone'),
('Events & Parties', 'Event promotions and party invitations', 'Calendar'),
('Real Estate', 'Property and real estate listings', 'Home'),
('Health & Fitness', 'Health, fitness and wellness ads', 'Heart'),
('Education', 'Educational services and courses', 'GraduationCap'),
('Automotive', 'Car and automotive services', 'Car'),
('Travel & Tourism', 'Travel and tourism promotions', 'Plane');

-- Function to update template usage count
CREATE OR REPLACE FUNCTION public.increment_template_usage(template_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.templates
  SET usage_count = usage_count + 1
  WHERE id = template_id;
  
  INSERT INTO public.template_usage (template_id, user_id)
  VALUES (template_id, auth.uid());
END;
$$;

-- Trigger function for template versioning
CREATE OR REPLACE FUNCTION public.create_template_version()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only create version if template_data changed
  IF (OLD.template_data IS DISTINCT FROM NEW.template_data) THEN
    INSERT INTO public.template_versions (template_id, version, template_data, created_by)
    VALUES (NEW.id, NEW.version, NEW.template_data, auth.uid());
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for template versioning
CREATE TRIGGER template_version_trigger
  AFTER UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION public.create_template_version();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_template_categories_updated_at
  BEFORE UPDATE ON public.template_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();