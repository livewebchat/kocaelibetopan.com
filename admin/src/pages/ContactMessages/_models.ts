export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  created_at: string;
  updated_at: string;
  admin_notes?: string;
  replied_at?: string;
  replied_by?: string;
};

export type ContactMessageStatus = 'new' | 'read' | 'replied' | 'closed';

export type ContactMessageUpdate = {
  status: ContactMessageStatus;
  admin_notes?: string;
  replied_by?: string;
};
