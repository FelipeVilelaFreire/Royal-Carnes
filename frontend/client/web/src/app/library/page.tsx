"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LibraryView } from "../../screens/library/LibraryView";

export default function LibraryPage() {
  const router = useRouter();

  return <LibraryView onNavigate={(path) => router.push(path)} />;
}
