import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/modules/profile/components/ProfileForm";
import { PasswordForm } from "@/modules/profile/components/PasswordForm";

export default function ProfilePage() {
  return (
    <Tabs defaultValue="data">
      <TabsList>
        <TabsTrigger value="data">Personal data</TabsTrigger>
        <TabsTrigger value="password">Change password</TabsTrigger>
      </TabsList>
      <TabsContent value="data" className="pt-4">
        <ProfileForm />
      </TabsContent>
      <TabsContent value="password" className="pt-4">
        <PasswordForm />
      </TabsContent>
    </Tabs>
  );
}
