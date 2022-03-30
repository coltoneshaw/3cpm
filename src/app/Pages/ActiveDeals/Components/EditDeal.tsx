import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/redux/hooks';
import type { Deals } from '@/types/3cAPI';
import { updateAllData } from '@/app/redux/threeCommas/Actions';
import { useThemeProvidor } from '@/app/Context/ThemeEngine';
import { logToConsole } from '@/utils/logging';
import { showAlert } from '@/app/Components/Popups/Popups';
import './EditDeal.scss';

const EditDeal = ({ originalDeal, open, onClose }: any) => {
  const theme = useThemeProvidor();
  const { styles } = theme;

  const { currentProfile } = useAppSelector((state) => state.config);

  const [deal, updateDeal] = useState({ id: -1, bot_name: '', take_profit: -1 });
  const [working, updateWorking] = useState(false);
  const [actionBtn, updateActionBtn] = useState('Change');

  const updateTP = (event: any) => {
    updateDeal({ ...deal, take_profit: parseFloat(event.target.value) });
  };

  useEffect(() => {
    if (originalDeal) {
      updateDeal({ ...originalDeal });
    }
  }, [originalDeal]);

  const saveChanges = async () => {
    updateActionBtn('Sending new settings to 3Commas');
    const req: Deals.Params.UpdateDeal = {
      deal_id: deal.id,
    };

    if (deal.take_profit !== originalDeal.take_profit) {
      req.take_profit = deal.take_profit;
    }

    updateWorking(true);
    logToConsole('debug', 'updating deal', req);
    const updatedDeal = await window.ThreeCPM.Repository.Deals.update(currentProfile, req);
    logToConsole('debug', 'update deal response', updatedDeal);
    if (updatedDeal?.error_description) {
      showAlert(updatedDeal.error_description);
    }

    updateActionBtn('Refreshing data');
    await updateAllData(currentProfile, 'fullSync', 1000);

    updateActionBtn('Change');
    updateWorking(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} style={{ ...styles }}>
      <div className="editDealModal">
        <DialogTitle>
          Edit
          {deal.bot_name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the bot deal
          </DialogContentText>

          {/*            <DialogContentText>
                <pre>{JSON.stringify(deal, null, 2)}</pre>
            </DialogContentText> */}

          <TextField
            margin="dense"
            id="take_profit"
            label="Take profit %"
            type="number"
            value={deal.take_profit}
            onChange={updateTP}
            inputProps={{ step: '0.01' }}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={onClose} disabled={working}>Cancel</Button>
          <Button variant="outlined" color="primary" onClick={saveChanges} disabled={working}>{actionBtn}</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default EditDeal;
