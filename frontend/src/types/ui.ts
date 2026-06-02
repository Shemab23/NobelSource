// need to delete this after

export type OAuthProvider = {
  id: string;
  label: string;
  authUrl: string;
  icon?: string;
};

export type InputField = {
  name: string;
  type: "text" | "email" | "password";
  label: string;
  placeholder: string;
  required: boolean;
};

export type BackgroundMedia = {
  imageUrl: string;
  overlayGradient?: string;
  alt: string;
};

export type LoginPage = {
  app: {
    name: string;
    tagline: string[];
    description: string;
  };

  ui: {
    theme: "light" | "dark";
    layout: "split" | "centered";
  };

  form: {
    title: string;
    subtitle: string;
    fields: InputField[];
    submitLabel: string;
    forgotPasswordLink: string;
  };

  oauth: {
    enabled: boolean;
    providers: OAuthProvider[];
  };

  signup: {
    prompt: string;
    linkText: string;
    linkUrl: string;
  };

  background: BackgroundMedia;

  footer: {
    text: string;
    links: { label: string; url: string }[];
  };
};

