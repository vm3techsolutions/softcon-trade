// app/search/page.js
'use client';
import React, { Suspense } from "react";
import SearchResult from './SearchResult';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading search results...</div>}>
      <SearchResult />
    </Suspense>
  );
}
