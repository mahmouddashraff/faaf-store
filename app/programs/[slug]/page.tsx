import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { programs, FitnessProgram } from '../../../lib/programs';
import ProgramDetailClient from './ProgramDetailClient';

export function generateStaticParams() {
  return programs.map(p => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const program = programs.find(p => p.slug === params.slug);
  if (!program) {
    return {
      title: 'Program Not Found | FAAF Fitness Magic',
    };
  }
  return {
    title: `${program.title} | FAAF Fitness Programs`,
    description: program.shortDescription,
  };
}

export default function ProgramDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const program = programs.find(p => p.slug === params.slug);

  if (!program) {
    notFound();
  }

  return <ProgramDetailClient program={program} />;
}
