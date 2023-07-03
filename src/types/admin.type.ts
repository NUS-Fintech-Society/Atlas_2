export type AddUsersType = {
  date_of_birth: string
  department: string
  discord: string
  diet: string
  faculty: string
  gender: string
  linkedin: string
  major: string
  name: string
  nus_email: string
  personal_email: string
  phone: string
  race: string
  role: string
  student_id: string
  telegram: string
  year: string
}

export type AddApplicantsType = {
  student_id: string
  nus_email: string
  name: string
  department: string
  role: string
  resume: string // google drive link
}

export type AddAppliedRolesType = {
  applicantId: string
  firstRole: string
  firstDepartment: string
  secondRole: string
  secondDepartment: string
}

export type AddUsersCSVType = {
  'Full Name': string
  'Date of Birth': string
  'Gender ': string
  'Race ': string
  Faculty: string
  'Major and Specialization (if any)': string
  'Year of Study': string
  Department: string
  'Appointed Role ': string
  Gmail: string
  'NUS email (xxx@u.nus.edu)': string
  'Student ID (AXXXXXXXX)': string
  'Phone Number': string
  'Telegram Handle(@xxx)': string
  'Discord ID (eg: _marcus#2873 please create an account if you do not have one as Discord will be one of our main forms of communication)': string
  'LinkedIn profile LINK (eg. www.linkedin.com/in/XXX)': string
  'Dietary Restrictions (eg. Allergic to seafood)': string
  'Shirt size': string
  'Hobbies ': string
}

export type AddApplicantsCSVType = {
  'Full Name': string
  'NUS email (xxx@u.nus.edu)': string
  'Student ID (AXXXXXXXX)': string
  'First Choice Role': string
  'First Choice Department': string
  'Second Choice Role': string
  'Second Choice Department': string
  Resume: string
}
