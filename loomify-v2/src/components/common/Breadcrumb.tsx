import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { BreadcrumbItem } from "@/types/breadcrumb";

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <nav
            aria-label="Breadcrumb"
            className="mb-12 flex flex-wrap items-center gap-2 text-sm text-gray-500"
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div
                        key={`${item.label}-${index}`}
                        className="flex items-center gap-2"
                    >
                        {isLast || !item.path ? (
                            <span className="font-medium text-primary">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.path}
                                className="transition hover:text-accent"
                            >
                                {item.label}
                            </Link>
                        )}

                        {!isLast && <ChevronRight size={16} />}
                    </div>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
