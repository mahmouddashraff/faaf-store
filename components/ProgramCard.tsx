'use client';

import React from 'react';
import Link from 'next/link';
import { FitnessProgram } from '../lib/programs';

export default function ProgramCard({ program }: { program: FitnessProgram }) {
  return (
    <article className="program-showcase-card">
      {/* Visual Header Banner */}
      <div className={`program-visual-banner ${program.accentColor}`}>
        <div className="program-banner-top">
          <span className="program-category-badge">{program.category.toUpperCase()}</span>
          <span className="program-difficulty-tag">{program.difficulty}</span>
        </div>

        <div className="program-artwork-box">
          <div className="program-symbol">⚡</div>
          <span className="program-brand-tag">FAAF SYSTEM</span>
        </div>

        <div className="program-banner-bottom">
          <span className="program-duration-pill">⏱️ {program.duration}</span>
          <span className="program-enrolled-pill">👥 {program.enrolledCount.toLocaleString()} Athletes</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="program-card-body">
        <h3 className="program-card-title">{program.title}</h3>
        <p className="program-tagline">{program.tagline}</p>
        <p className="program-short-desc">{program.shortDescription}</p>

        {/* Key Benefits Checklist */}
        <div className="program-benefits-mini">
          <div className="benefits-label">WHAT&apos;S INCLUDED:</div>
          {program.keyBenefits.slice(0, 3).map((benefit, i) => (
            <div key={i} className="benefit-item-row">
              <span className="benefit-check">✓</span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Rating and Price */}
        <div className="program-card-meta">
          <div className="program-rating">
            <span className="stars">★★★★★</span>
            <strong>{program.rating}</strong>
            <small>({program.reviews} reviews)</small>
          </div>
          <div className="program-price-badge">
            {((typeof program.price === 'number' ? program.price : parseFloat((String(program.price) || '').replace(/[^0-9.]/g, '')) || 0) > 0) ? `$${(typeof program.price === 'number' ? program.price : parseFloat((String(program.price) || '').replace(/[^0-9.]/g, ''))).toFixed(2)}` : 'FREE'}
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/programs/${program.slug}`} className="secondary-btn full-width">
          VIEW DETAILS
        </Link>
      </div>
    </article>
  );
}
