-- Create fee_structures table for managing fee types and amounts
CREATE TABLE public.fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year VARCHAR(20) NOT NULL,
    term VARCHAR(20) NOT NULL,
    class VARCHAR(50) NOT NULL,
    fee_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_fees table for tracking individual student payments
CREATE TABLE public.student_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    term VARCHAR(20) NOT NULL,
    total_fees DECIMAL(10,2) NOT NULL DEFAULT 0,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    balance DECIMAL(10,2) GENERATED ALWAYS AS (total_fees - amount_paid) STORED,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table for payment history
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_fee_id UUID REFERENCES public.student_fees(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reference_number VARCHAR(100),
    receipt_number VARCHAR(100),
    notes TEXT,
    recorded_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Fee Structures: Admin can manage, others can view
CREATE POLICY "Admins can manage fee structures"
ON public.fee_structures FOR ALL
USING (public.is_admin());

CREATE POLICY "Authenticated users can view fee structures"
ON public.fee_structures FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Student Fees: Role-based access
CREATE POLICY "Admins can manage all student fees"
ON public.student_fees FOR ALL
USING (public.is_admin());

CREATE POLICY "Students can view their own fees"
ON public.student_fees FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = student_fees.student_id
    AND s.user_id = auth.uid()
));

CREATE POLICY "Parents can view their children fees"
ON public.student_fees FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.students s
    JOIN public.parents p ON p.id = s.parent_id
    WHERE s.id = student_fees.student_id
    AND p.user_id = auth.uid()
));

CREATE POLICY "Teachers can view assigned students fees status only"
ON public.student_fees FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.student_teacher_assignments sta
    JOIN public.teachers t ON t.id = sta.teacher_id
    WHERE sta.student_id = student_fees.student_id
    AND t.user_id = auth.uid()
));

-- Payments: Role-based access
CREATE POLICY "Admins can manage all payments"
ON public.payments FOR ALL
USING (public.is_admin());

CREATE POLICY "Students can view their own payments"
ON public.payments FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = payments.student_id
    AND s.user_id = auth.uid()
));

CREATE POLICY "Parents can view their children payments"
ON public.payments FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.students s
    JOIN public.parents p ON p.id = s.parent_id
    WHERE s.id = payments.student_id
    AND p.user_id = auth.uid()
));

-- Create triggers for updated_at
CREATE TRIGGER update_fee_structures_updated_at
BEFORE UPDATE ON public.fee_structures
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_fees_updated_at
BEFORE UPDATE ON public.student_fees
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample fee structures
INSERT INTO public.fee_structures (academic_year, term, class, fee_type, amount) VALUES
('2026', 'Term 1', 'Grade 7', 'Tuition', 15000.00),
('2026', 'Term 1', 'Grade 7', 'Boarding', 8000.00),
('2026', 'Term 1', 'Grade 7', 'Activity', 2000.00),
('2026', 'Term 1', 'Grade 8', 'Tuition', 16000.00),
('2026', 'Term 1', 'Grade 8', 'Boarding', 8500.00),
('2026', 'Term 1', 'Grade 8', 'Activity', 2000.00),
('2026', 'Term 1', 'Grade 9', 'Tuition', 18000.00),
('2026', 'Term 1', 'Grade 9', 'Boarding', 9000.00),
('2026', 'Term 1', 'Grade 9', 'Activity', 2500.00);