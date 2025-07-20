import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobData {
  jobTitle: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

interface PublishRequest {
  job: JobData;
  platforms: string[];
  webhookUrls?: string[];
}

async function publishToLinkedIn(job: JobData): Promise<{ success: boolean; error?: string }> {
  const linkedinToken = Deno.env.get('LINKEDIN_ACCESS_TOKEN');
  
  if (!linkedinToken) {
    return { success: false, error: 'LinkedIn token not configured' };
  }

  try {
    // LinkedIn Job Posting API
    const jobPost = {
      author: `urn:li:organization:${Deno.env.get('LINKEDIN_ORGANIZATION_ID')}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: `🌟 Nova vaga disponível!\n\n${job.jobTitle} - ${job.company}\n📍 ${job.location}\n💼 ${job.jobType}\n💰 ${job.salary}\n\n${job.description.substring(0, 200)}...\n\n#vagas #emprego #oportunidade`
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${linkedinToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(jobPost)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LinkedIn API error:', error);
      return { success: false, error: `LinkedIn API error: ${response.status}` };
    }

    console.log('Job published to LinkedIn successfully');
    return { success: true };
  } catch (error) {
    console.error('Error publishing to LinkedIn:', error);
    return { success: false, error: error.message };
  }
}

async function sendToWebhooks(job: JobData, webhookUrls: string[]): Promise<void> {
  const webhookData = {
    event: 'job_created',
    timestamp: new Date().toISOString(),
    data: job
  };

  const webhookPromises = webhookUrls.map(async (url) => {
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });
      console.log(`Webhook sent to: ${url}`);
    } catch (error) {
      console.error(`Failed to send webhook to ${url}:`, error);
    }
  });

  await Promise.all(webhookPromises);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { job, platforms, webhookUrls }: PublishRequest = await req.json();

    console.log('Publishing job:', job.jobTitle);
    
    const results: any = {
      job: job.jobTitle,
      platforms: {},
      webhooks: webhookUrls ? 'sent' : 'none'
    };

    // Publish to requested platforms
    if (platforms.includes('linkedin')) {
      const linkedinResult = await publishToLinkedIn(job);
      results.platforms.linkedin = linkedinResult;
    }

    // Send to N8n/workflow webhooks
    if (webhookUrls && webhookUrls.length > 0) {
      await sendToWebhooks(job, webhookUrls);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Job publishing initiated',
      results
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in publish-job function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);