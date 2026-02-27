import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProductImageResponse {
  success: boolean;
  image?: string;
  title?: string;
  description?: string;
  error?: string;
}

async function fetchProductImage(url: string): Promise<ProductImageResponse> {
  try {
    console.log('Fetching product image from:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract Open Graph image
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    const ogDescriptionMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
    
    // Fallback to other image meta tags
    const twitterImageMatch = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
    const itemImageMatch = html.match(/<meta\s+itemprop=["']image["']\s+content=["']([^"']+)["']/i);
    
    // Try to find the first img tag as last resort
    const imgTagMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    
    let imageUrl = ogImageMatch?.[1] || twitterImageMatch?.[1] || itemImageMatch?.[1];
    
    // If no meta image found, try img tag
    if (!imageUrl && imgTagMatch) {
      imageUrl = imgTagMatch[1];
    }
    
    if (!imageUrl) {
      return {
        success: false,
        error: 'No product image found'
      };
    }
    
    // Make sure the image URL is absolute
    if (imageUrl.startsWith('//')) {
      imageUrl = 'https:' + imageUrl;
    } else if (imageUrl.startsWith('/')) {
      const urlObj = new URL(url);
      imageUrl = urlObj.origin + imageUrl;
    }
    
    console.log('Found product image:', imageUrl);
    
    return {
      success: true,
      image: imageUrl,
      title: ogTitleMatch?.[1]?.replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
      description: ogDescriptionMatch?.[1]?.replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    };
    
  } catch (error) {
    console.error('Error fetching product image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch product image'
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }
    
    const result = await fetchProductImage(url);
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      }
    );
    
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});