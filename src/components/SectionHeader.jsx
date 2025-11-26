import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SectionHeader = ({ title, linkTo }) => (
    <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-2 mt-12">
        <h2 className="text-2xl font-black font-serif uppercase tracking-tight">
            {title}
        </h2>
        {linkTo && (
            <Link to={linkTo} className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-800">
                View All <ArrowRight className="w-3 h-3" />
            </Link>
        )}
    </div>
);

export default SectionHeader;