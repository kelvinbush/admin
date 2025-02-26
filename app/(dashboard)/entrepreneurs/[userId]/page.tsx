"use client";

import { redirect, useParams } from "next/navigation";

export default function BusinessProfilePage() {
  const { userId } = useParams();

  redirect(`/entrepreneurs/${userId}/personal-information`);
}
