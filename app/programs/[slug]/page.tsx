import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import ProgramDetailClient from './ProgramDetailClient';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!program || program.is_archived) {
    return {
      title: 'Program Not Found | FAAF Fitness Magic',
    };
  }
  return {
    title: `${program.title} | FAAF Fitness Programs`,
    description: program.short_description,
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!program || program.is_archived) {
    notFound();
  }

  return <ProgramDetailClient program={program} />;
}
