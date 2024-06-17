import React from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
    label: string;
    path?: string;
}

interface BreadcrumbProps {
    crumbs: Crumb[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
    const baseCrumb = { label: 'LinguifAI', path: '/' };
    const allCrumbs = [baseCrumb, ...crumbs];

    return (
        <div className="p-4">
            <nav aria-label="breadcrumb">
                <ol className="flex space-x-2 text-lg">
                    {allCrumbs.map((crumb, index) => (
                        <li key={index} className={`flex items-center ${!crumb.path ? 'text-gray-500' : ''}`}>
                            {index !== 0 && <span className="mx-2 text-gray-400">/</span>}
                            {crumb.path ? (
                                <Link to={crumb.path} className="text-blue-800 hover:underline font-semibold">{crumb.label}</Link>
                            ) : (<span className="font-semibold">{crumb.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};

export default Breadcrumb;
