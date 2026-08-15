import { supabase } from './supabaseClient';

export const getFamiliesNested = async () => {
  const { data: families } = await supabase.from('families').select('*');
  const { data: students } = await supabase.from('students').select('*');
  const { data: payments } = await supabase.from('payments').select('*');

  if (!families) return [];

  return families.map(f => {
    const familyStudents = students ? students.filter(s => s.parent_id === f.id) : [];
    
    const children = familyStudents.map(s => {
      const studentPayments = payments ? payments.filter(p => p.student_id === s.id) : [];
      return {
        id: s.id,
        name: s.name,
        grade: s.grade,
        sex: s.sex || 'M',
        totalAmount: s.total_amount || 0,
        payments: studentPayments.map(p => ({
          id: p.id.toString(),
          title: p.tranche_title,
          amountExpected: p.amount,
          amountPaid: p.amount_paid || 0,
          deadline: p.date,
          isFullyPaid: (p.amount_paid || 0) >= p.amount
        }))
      };
    });

    return {
      id: f.id,
      parentName: f.parent_name,
      parentWhatsapp: f.whatsapp,
      parentDirectCall: f.phone,
      parentId: f.parent_id || '',
      parentPassword: f.password || '',
      children: children
    };
  });
};

export const saveFamiliesToSupabase = async (families) => {
  const familyRows = [];
  const studentRows = [];
  const paymentRows = [];

  families.forEach(f => {
    familyRows.push({
      id: f.id,
      parent_name: f.parentName,
      whatsapp: f.parentWhatsapp,
      phone: f.parentDirectCall,
      parent_id: f.parentId,
      password: f.parentPassword
    });

    if (f.children) {
      f.children.forEach(s => {
        studentRows.push({
          id: s.id,
          parent_id: f.id,
          name: s.name,
          grade: s.grade,
          sex: s.sex,
          total_amount: s.totalAmount
        });

        if (s.payments) {
          s.payments.forEach(p => {
            paymentRows.push({
              id: p.id,
              student_id: s.id,
              tranche_title: p.title,
              amount: p.amountExpected,
              amount_paid: p.amountPaid,
              date: p.deadline
            });
          });
        }
      });
    }
  });

  if (familyRows.length > 0) await supabase.from('families').upsert(familyRows);
  if (studentRows.length > 0) await supabase.from('students').upsert(studentRows);
  if (paymentRows.length > 0) await supabase.from('payments').upsert(paymentRows);
};

export const deleteFamilyFromSupabase = async (familyId) => {
  await supabase.from('families').delete().eq('id', familyId);
};

export const addTransaction = async (transaction) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (currentUser.role === 'admin') {
    transaction.recorded_by = currentUser.name || 'Administrateur';
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      transaction.recorded_by = user.user_metadata?.name || user.email;
    }
  }

  const { data, error } = await supabase.from('transactions').insert([transaction]);
  if (error) {
    console.error('Erreur lors de l\'ajout de la transaction:', error);
  }
  return { data, error };
};

export const getStudentTransactions = async (studentId) => {
  const { data, error } = await supabase.from('transactions').select(`
    *,
    students (name, grade)
  `).eq('student_id', studentId).order('date', { ascending: false });
  if (error) {
    console.error('Erreur lors de la récupération des transactions de l\'élève:', error);
    return [];
  }
  return data;
};

export const getTransactions = async () => {
  const { data, error } = await supabase.from('transactions').select(`
    *,
    students (name, grade)
  `).order('date', { ascending: false });
  if (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    return [];
  }
  return data;
};
