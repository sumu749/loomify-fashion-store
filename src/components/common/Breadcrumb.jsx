import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
    return (
        <nav className="mb-12 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={item.label} className="flex items-center gap-2">
                        {isLast ? (
                            <span className="font-medium text-primary">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                to={item.path}
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
