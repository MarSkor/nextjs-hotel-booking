// import { redirect } from "next/navigation";
import { AccountOverview } from "@/features/account/components";

export default async function PrivatePage() {
  // const supabase = await createClient();

  // const { data, error } = await supabase.auth.getUser();
  // if (error || !data?.user) {
  //   redirect("/login");
  // }

  return (
    <AccountOverview
    // userData={data}
    />
  );
}
