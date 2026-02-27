import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReportAdFormProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  adTitle: string;
}

const ReportAdForm: React.FC<ReportAdFormProps> = ({ isOpen, onClose, adId, adTitle }) => {
  const [reporterName, setReporterName] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reporterName.trim() || !complaintType || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('requests')
        .insert({
          full_name: reporterName,
          email: 'report@somadz.com', // Placeholder email for reports
          subject: `Report Ad: ${complaintType}`,
          message: `Ad ID: ${adId}\nAd Title: ${adTitle}\nComplaint Type: ${complaintType}\n\nDetails:\n${message}`,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "Your report has been submitted for admin review",
      });

      // Reset form
      setReporterName("");
      setComplaintType("");
      setMessage("");
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report This Ad</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reporterName">Your Name *</Label>
            <Input
              id="reporterName"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <Label htmlFor="complaintType">Complaint Type *</Label>
            <Select value={complaintType} onValueChange={setComplaintType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select complaint type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scam">Scam</SelectItem>
                <SelectItem value="fake_product">Fake Product</SelectItem>
                <SelectItem value="offensive_content">Offensive Content</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe the issue in detail..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportAdForm;