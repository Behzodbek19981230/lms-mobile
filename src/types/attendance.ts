export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type BulkAttendancePayload = {
  groupId: number;
  date: string; // YYYY-MM-DD
  attendanceRecords: Array<{
    studentId: number;
    status: AttendanceStatus;
  }>;
};
