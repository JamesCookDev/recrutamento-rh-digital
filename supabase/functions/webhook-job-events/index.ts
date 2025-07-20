import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobEvent {
  eventType: 'job_created' | 'job_updated' | 'job_deleted' | 'candidate_applied';
  jobId: string;
  jobData?: any;
  candidateData?: any;
  timestamp: string;
  metadata?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const eventType = url.searchParams.get('event') || 'job_created';

    if (req.method === 'GET') {
      // Endpoint para N8n descobrir os eventos disponíveis
      return new Response(JSON.stringify({
        available_events: [
          'job_created',
          'job_updated', 
          'job_deleted',
          'candidate_applied'
        ],
        webhook_url: `${url.origin}/webhook-job-events`,
        description: 'Webhook endpoints for job and candidate events',
        usage: {
          'job_created': 'Triggered when a new job is created',
          'job_updated': 'Triggered when a job is updated',
          'job_deleted': 'Triggered when a job is deleted',
          'candidate_applied': 'Triggered when a candidate applies'
        }
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'POST') {
      const data = await req.json();
      
      const jobEvent: JobEvent = {
        eventType: (data.eventType || eventType) as JobEvent['eventType'],
        jobId: data.jobId || data.id || 'unknown',
        jobData: data.jobData || data,
        candidateData: data.candidateData,
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'recruitment_system',
          userAgent: req.headers.get('user-agent'),
          ip: req.headers.get('x-forwarded-for') || 'unknown'
        }
      };

      console.log('Job event received:', JSON.stringify(jobEvent, null, 2));

      // Aqui você pode processar o evento
      // Por exemplo, salvar em banco de dados, enviar para outros sistemas, etc.
      
      // Para N8n, apenas logamos e retornamos sucesso
      return new Response(JSON.stringify({
        success: true,
        message: 'Event processed successfully',
        event: jobEvent,
        processedAt: new Date().toISOString()
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in webhook-job-events function:', error);
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