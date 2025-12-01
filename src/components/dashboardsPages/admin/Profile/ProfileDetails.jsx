import ProfileImage from "./ProfileImage";
import ProfileField from "./ProfileField";

export default function ProfileDetails({ user }) {
  return (
    <div className="p-6 bg-white shadow rounded-2xl w-full max-w-md mx-auto">
      <ProfileImage />
      <ProfileField label="Name" value={user.name} />
      <ProfileField label="Email" value={user.email} />
      <ProfileField label="Phone" value={user.phone} />
      <ProfileField label="Role" value={user.role} />
      <ProfileField label="Status" value={user.status} />
      <ProfileField label="Team Head ID" value={user.teamHeadId} />
    </div>
  );
}
