-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums for the recruitment system
CREATE TYPE public.contract_type AS ENUM ('clt', 'internship', 'temporary', 'contractor');
CREATE TYPE public.position_level AS ENUM ('strategic', 'tactical', 'operational');
CREATE TYPE public.recruitment_type AS ENUM ('internal', 'external');
CREATE TYPE public.request_type AS ENUM ('replacement', 'headcount_increase', 'other');
CREATE TYPE public.service_type AS ENUM ('internal', 'external_consultant', 'mixed');
CREATE TYPE public.position_status AS ENUM ('draft', 'open', 'in_progress', 'closed', 'cancelled');
CREATE TYPE public.candidate_status AS ENUM ('applied', 'screening', 'interview', 'technical_test', 'final_interview', 'approved', 'rejected', 'hired');
CREATE TYPE public.interview_type AS ENUM ('screening', 'technical', 'behavioral', 'final');
CREATE TYPE public.interview_status AS ENUM ('scheduled', 'completed', 'cancelled', 'rescheduled');

-- Create positions table
CREATE TABLE public.positions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    job_title TEXT NOT NULL,
    position_code TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL,
    contract_type contract_type NOT NULL,
    salary NUMERIC(10,2),
    position_level position_level NOT NULL,
    recruitment_type recruitment_type NOT NULL,
    request_type request_type NOT NULL,
    location TEXT NOT NULL,
    source_of_capture TEXT NOT NULL,
    approver TEXT NOT NULL,
    hr_responsible TEXT NOT NULL,
    manager_responsible TEXT NOT NULL,
    opening_date DATE NOT NULL,
    expected_start_date DATE,
    replaced_employee TEXT,
    benefits TEXT,
    requirements TEXT NOT NULL,
    service_type service_type NOT NULL,
    observations TEXT,
    status position_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create candidates table
CREATE TABLE public.candidates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    linkedin_url TEXT,
    resume_url TEXT,
    current_position TEXT,
    current_company TEXT,
    experience_years INTEGER,
    salary_expectation NUMERIC(10,2),
    availability_date DATE,
    status candidate_status NOT NULL DEFAULT 'applied',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create position_candidates table (many-to-many relationship)
CREATE TABLE public.position_candidates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    position_id UUID NOT NULL REFERENCES public.positions(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    status candidate_status NOT NULL DEFAULT 'applied',
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(position_id, candidate_id)
);

-- Create interviews table
CREATE TABLE public.interviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    position_candidate_id UUID NOT NULL REFERENCES public.position_candidates(id) ON DELETE CASCADE,
    interviewer_name TEXT NOT NULL,
    interviewer_email TEXT NOT NULL,
    interview_type interview_type NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location TEXT,
    meeting_link TEXT,
    status interview_status NOT NULL DEFAULT 'scheduled',
    feedback TEXT,
    score INTEGER CHECK (score >= 1 AND score <= 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create documents table
CREATE TABLE public.documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    uploaded_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_positions_status ON public.positions(status);
CREATE INDEX idx_positions_department ON public.positions(department);
CREATE INDEX idx_positions_opening_date ON public.positions(opening_date);
CREATE INDEX idx_candidates_email ON public.candidates(email);
CREATE INDEX idx_candidates_status ON public.candidates(status);
CREATE INDEX idx_position_candidates_position_id ON public.position_candidates(position_id);
CREATE INDEX idx_position_candidates_candidate_id ON public.position_candidates(candidate_id);
CREATE INDEX idx_position_candidates_status ON public.position_candidates(status);
CREATE INDEX idx_interviews_scheduled_date ON public.interviews(scheduled_date);
CREATE INDEX idx_interviews_status ON public.interviews(status);
CREATE INDEX idx_documents_candidate_id ON public.documents(candidate_id);

-- Enable Row Level Security
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.position_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for positions
CREATE POLICY "Everyone can view positions" 
ON public.positions 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create positions" 
ON public.positions 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update positions" 
ON public.positions 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete positions" 
ON public.positions 
FOR DELETE 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for candidates
CREATE POLICY "Authenticated users can view candidates" 
ON public.candidates 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create candidates" 
ON public.candidates 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update candidates" 
ON public.candidates 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete candidates" 
ON public.candidates 
FOR DELETE 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for position_candidates
CREATE POLICY "Authenticated users can view position_candidates" 
ON public.position_candidates 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create position_candidates" 
ON public.position_candidates 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update position_candidates" 
ON public.position_candidates 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete position_candidates" 
ON public.position_candidates 
FOR DELETE 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for interviews
CREATE POLICY "Authenticated users can view interviews" 
ON public.interviews 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create interviews" 
ON public.interviews 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update interviews" 
ON public.interviews 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete interviews" 
ON public.interviews 
FOR DELETE 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for documents
CREATE POLICY "Authenticated users can view documents" 
ON public.documents 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create documents" 
ON public.documents 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update documents" 
ON public.documents 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete documents" 
ON public.documents 
FOR DELETE 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_positions_updated_at
    BEFORE UPDATE ON public.positions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
    BEFORE UPDATE ON public.candidates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_position_candidates_updated_at
    BEFORE UPDATE ON public.position_candidates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
    BEFORE UPDATE ON public.interviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('recruitment-documents', 'recruitment-documents', false);

-- Create storage policies for recruitment documents
CREATE POLICY "Authenticated users can view recruitment documents" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'recruitment-documents');

CREATE POLICY "Authenticated users can upload recruitment documents" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'recruitment-documents');

CREATE POLICY "Authenticated users can update recruitment documents" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'recruitment-documents');

CREATE POLICY "Authenticated users can delete recruitment documents" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'recruitment-documents');