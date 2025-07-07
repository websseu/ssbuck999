import { z } from 'zod'

// 문의사항
export const ContactSchema = z.object({
  email: z.string().email({ message: '→ 유효한 이메일을 입력해주세요.' }),
  message: z
    .string()
    .min(10, { message: '→ 메시지는 최소 10자 이상 입력해주세요.' })
    .max(300, { message: '→ 메시지는 최대 300자까지 입력할 수 있습니다.' }),
  status: z.enum(['대기중', '확인완료', '답장완료']).optional(),
})

// 회원가입 1단계: 약관 동의
export const TermsAgreementSchema = z.object({
  termsOfService: z.boolean().refine((val) => val === true, {
    message: '→ 이용약관에 동의해주세요.',
  }),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: '→ 개인정보취급방침에 동의해주세요.',
  }),
  allAgreed: z.boolean().optional(),
})

// 회원가입 2단계: 이메일 입력
export const EmailOnlySchema = z.object({
  email: z.string().email('→ 유효한 이메일 주소를 입력해주세요.'),
})

// 회원가입 3단계: 이메일 인증
export const VerifyEmailSchema = z.object({
  email: z.string().email('→ 유효한 이메일 주소를 입력해주세요.'),
  verificationCode: z.string().length(6, '→ 인증번호는 6자리여야 합니다.'),
})

// 회원가입 4단계: 사용자 정보 입력
export const UserSignUpSchema = z
  .object({
    email: z.string().email('→ 유효한 이메일 주소를 입력해주세요.'),
    name: z
      .string()
      .min(2, '→ 이름은 최소 2자 이상이어야 합니다.')
      .max(20, '→ 이름은 최대 20자까지 입력할 수 있습니다.'),
    password: z
      .string()
      .min(6, '→ 비밀번호는 최소 6자 이상이어야 합니다.')
      .regex(/[A-Z]/, '→ 비밀번호에는 최소 하나의 대문자가 포함되어야 합니다.')
      .regex(/[0-9]/, '→ 비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.'),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.confirmPassword || data.password === data.confirmPassword,
    {
      message: '→ 비밀번호가 일치하지 않습니다.',
      path: ['confirmPassword'],
    }
  )

// 로그인
export const UserSignInSchema = z.object({
  email: z.string().email('→ 유효한 이메일 주소를 입력해주세요.'),
  password: z
    .string()
    .min(6, '→ 비밀번호는 최소 6자 이상이어야 합니다.')
    .regex(/[A-Z]/, '→ 비밀번호에는 최소 하나의 대문자가 포함되어야 합니다.')
    .regex(/[0-9]/, '→ 비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.'),
})

// 비밀번호 리셋
export const PasswordResetSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    verificationCode: z
      .string()
      .min(6, '인증번호는 6자리입니다.')
      .max(6, '인증번호는 6자리입니다.'),
    newPassword: z
      .string()
      .min(8, '비밀번호는 최소 8자리 이상이어야 합니다.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })
