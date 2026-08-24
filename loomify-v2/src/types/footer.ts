import type { ComponentType } from "react";

export interface FooterLink {
    name: string;
    path: string;
}

export interface SocialLink {
    name: string;
    icon: ComponentType<{ size?: number }>;
    url: string;
}
