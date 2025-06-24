export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export enum GradeLevel {
  KINDERGARTEN = 'kindergarten',
  GRADE_1 = 'grade_1',
  GRADE_2 = 'grade_2',
  GRADE_3 = 'grade_3',
  GRADE_4 = 'grade_4',
  GRADE_5 = 'grade_5',
  GRADE_6 = 'grade_6',
  GRADE_7 = 'grade_7',
  GRADE_8 = 'grade_8',
  GRADE_9 = 'grade_9',
  GRADE_10 = 'grade_10',
  GRADE_11 = 'grade_11',
  GRADE_12 = 'grade_12',
}

export enum TermType {
  FIRST_TERM = 'first_term',
  SECOND_TERM = 'second_term',
  THIRD_TERM = 'third_term',
  ANNUAL = 'annual',
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
