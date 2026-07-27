// Shapes returned by the ASP.NET Core Web API (System.Text.Json camelCase).

export interface TemplateDto {
  id: string;
  code: string;
  category: string;
  imageUrl: string;
  isPopular: boolean;
}

export interface UserDto {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
}

export interface CreateInvitationRequest {
  templateId?: string;
}

export interface InvitationDto {
  id: string;
  status: string;
  editUrl: string;
}
