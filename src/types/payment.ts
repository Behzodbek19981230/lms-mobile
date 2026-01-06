export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | string;

export type Payment = {
  id: string | number;
  amount: number;
  status: PaymentStatus;
  dueDate?: string;
  paidDate?: string;
  description?: string;
  student?: {
    id: string | number;
    firstName: string;
    lastName: string;
    username: string;
  };
  group?: {
    id: string | number;
    name: string;
    subject?: { name: string } | null;
  };
};

export type TeacherPaymentsResponse = {
  payments: Payment[];
  studentsWithoutGroup: Array<{
    id: number;
    firstName: string;
    lastName: string;
    username: string;
  }>;
};
