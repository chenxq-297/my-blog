export const normalizeEmail = (value: string) => value.trim().toLowerCase();

type CanCreateUserInput = {
  bootstrapSecret: string;
  configuredEmail: string;
  existingUserCount: number;
  requestEmail: string;
  requestHeader: string | null;
};

export const canCreateUser = ({
  bootstrapSecret,
  configuredEmail,
  existingUserCount,
  requestEmail,
  requestHeader,
}: CanCreateUserInput) => {
  if (existingUserCount > 0) {
    return false;
  }

  if (requestHeader !== bootstrapSecret) {
    return false;
  }

  return normalizeEmail(requestEmail) === normalizeEmail(configuredEmail);
};
