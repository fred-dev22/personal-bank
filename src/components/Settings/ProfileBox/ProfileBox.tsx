import { Button } from "@jbaluch/components";
//@ts-expect-error - External CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import "./profile-box.css";
import { useAuth } from '../../../contexts/AuthContext';

interface Props {
  className?: string;
  headerClassName?: string;
  line?: string;
  img?: string;
  mailOutline?: string;
  call?: string;
  locationOn?: string;
}

export const ProfileBox = ({
  className,
  headerClassName,
  line = "line.svg",
  img = "image.svg",
  mailOutline = "mail-outline.svg",
  call = "call.svg",
  locationOn = "location-on.svg",
}: Props) => {
  const { user } = useAuth();
  return (
    <div className={`profile-box ${className}`} style={{ width: '100%' }}>
      <div className={`header ${headerClassName}`}>
        <div className="profile-image">
          <div className="profile-avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.firstName?.[0] || 'X'}${user?.lastName?.[0] || 'X'}&background=random`} 
              alt="Profile Avatar"
              className="avatar-image"
            />
          </div>
          <div className="profile">
            <div className="name">
              <div className="text-wrapper">{user?.fullName || 'xxxxxx'}</div>
            </div>

            <div className="occupation-income">
              <div className="div">{user?.roles?.[0] || 'xxxxxx'}</div>
              <img className="line" alt="Line" src={line} />
              <div className="div">{'$xx,xxx gross'}</div>
              <img className="line" alt="Line" src={img} />
              <div className="div">{'$xx,xxx after tax'}</div>
            </div>
          </div>
        </div>

        <Button
          className="edit-profile-btn"
          icon="iconless"
          text="Edit Profile"
          type="secondary"
          iconComponent={null}
          onClick={() => {}}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          disabled={false}
          size="medium"
          name="edit-profile"
          form=""
          ariaLabel=""
          style={{ height: '40px', width: '120px' }}
        >
          Edit Profile
        </Button>
      </div>

      <div className="contact">
        <div className="profile-contact-row">
          <img className="img" alt="Mail outline" src={mailOutline} />
          <span className="email">{user?.email || "xxxxxx"}</span>
        </div>

        <div className="profile-contact-row">
          <img className="img" alt="Call" src={call} />
          <div className="number-wrapper">
            <div className="number">{'xxx-xxx-xxxx'}</div>
          </div>
        </div>

        <div className="location">
          <img className="img" alt="Location on" src={locationOn} />
          <div className="number-wrapper">
            <div className="number-2">{'xxxxxx'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 