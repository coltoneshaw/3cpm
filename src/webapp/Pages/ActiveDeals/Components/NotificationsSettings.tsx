import { Checkbox, FormControlLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/webapp/redux/hooks';
import { updateNotificationsSettingsGlobal } from '@/webapp/redux/config/configActions';

/**
 *
 * @returns Checkboxes for configuring the state of auto sync.
 */
const NotificationsSettings = () => {
  const {
    enabled: storeEnabled,
    summary: storeSummary,
  } = useAppSelector((state) => state.config.config.globalSettings.notifications);

  const [summary, setSummary] = useState(() => storeSummary);
  const [enabled, setEnabled] = useState(() => storeEnabled);

  useEffect(() => {
    setSummary(storeSummary);
    setEnabled(storeEnabled);
  }, [storeEnabled, storeSummary]);

  const changeSummary = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    updateNotificationsSettingsGlobal({ summary: checked });
    setSummary(checked);
  };

  const changeEnabled = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (!checked) {
      updateNotificationsSettingsGlobal({ summary: false });
      setSummary(false);
    }
    updateNotificationsSettingsGlobal({ enabled: checked });
    setEnabled(checked);
  };

  return (
    <div className="notificationsSettings">
      <FormControlLabel
        control={(
          <Checkbox
            checked={enabled}
            onChange={changeEnabled}
            name="notifications"
            color="primary"
            style={{ color: 'var(--color-secondary)' }}
          />
        )}
        label="Enable Notifications"
      />
      <FormControlLabel
        control={(
          <Checkbox
            checked={summary}
            onChange={changeSummary}
            name="summary"
            style={{ color: 'var(--color-secondary)' }}
          />
        )}
        label="Summarize Notifications"
      />

    </div>
  );
};

export default NotificationsSettings;
