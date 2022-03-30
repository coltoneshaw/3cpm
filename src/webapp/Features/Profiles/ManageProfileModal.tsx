import React from 'react';

import {
  Dialog,
  DialogContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import { deleteProfileByIdGlobal } from '@/webapp/redux/config/configActions';
import { useAppSelector } from '@/webapp/redux/hooks';
// import AddIcon from '@mui/icons-material/Add';

// import TextField from '@mui/material/TextField';
import { ConfigValuesType, ProfileType } from '@/types/config';

import { useThemeProvidor } from '@/webapp/Context/ThemeEngine';

interface ProfileModalProps {
  open: boolean
  setOpen: any
  profiles: ConfigValuesType['profiles'] | {}
  // currentProfileId: string
}

const returnMappedProfiles = (profiles: ConfigValuesType['profiles'] | {}, config: ConfigValuesType) => {
  if (!profiles || profiles === {}) return null;

  return Object.keys(profiles).map((p) => {
    const mappedProf: ProfileType = profiles[p as keyof typeof profiles];

    return (
      <div className="flex-row selectedCoinDiv" key={p}>
        <p
          style={
            { flexBasis: '90%' }
          }
        >
          {mappedProf.name}
        </p>
        <Delete
          style={{
            flexBasis: '10%',
            cursor: 'pointer',
          }}
          onClick={() => {
            deleteProfileByIdGlobal(config, p, undefined);
          }}
        />
      </div>
    );
  });
};

const ManageProfileModal: React.FC<ProfileModalProps> = ({ open, setOpen, profiles }) => {
  const { config } = useAppSelector((state) => state.config);

  // TODO
  // - Add an edit button
  // - setup the delete button to properly delete the profile. Possibly trigger a warning
  // - add a set Current Profile button that controls the state in the back.

  const handleClose = () => {
    setOpen(false);
  };

  const theme = useThemeProvidor();
  const { styles } = theme;

  return (
    <Dialog
      fullWidth={false}
      maxWidth="md"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      style={{

        color: 'var(--color-text-lightbackground)',
        padding: 0,
        ...styles,

      }}
    >
      <DialogContent style={{ padding: 0 }}>
        <div className="flex-row addCoinModal">
          <CloseIcon className="closeIcon" onClick={handleClose} />
          <div
            className="flex-column"
            style={{
              width: '100%',
            }}
          >
            <h2 style={{ textAlign: 'center' }}>Profiles</h2>
            {returnMappedProfiles(profiles, config)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageProfileModal;
