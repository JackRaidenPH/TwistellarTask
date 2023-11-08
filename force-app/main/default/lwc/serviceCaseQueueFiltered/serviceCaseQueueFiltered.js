import { LightningElement, wire, track } from 'lwc';
import getUserCases from '@salesforce/apex/ServiceCaseQueueService.getUserCases';

import CASE_NUMBER from '@salesforce/schema/Case.CaseNumber';
import CASE from '@salesforce/schema/Case';
import CASE_STATUS from '@salesforce/schema/Case.Status';
import PRIORITY from '@salesforce/schema/Case.Priority';
import ORIGIN from '@salesforce/schema/Case.Origin';

import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';

const COLUMNS = [
    { label: 'Case Number', fieldName: 'caseNumberURL', type: 'url', typeAttributes: { label: { fieldName: CASE_NUMBER.fieldApiName }, target: '_blank' }},
    { label: 'Assignee', fieldName: "ownerName", type: 'text' },
    {
        label: 'Case Status', fieldName: CASE_STATUS.fieldApiName, type: 'picklistColumn', editable: true, typeAttributes: {
            placeholder: 'Choose Status', options: { fieldName: 'pickListOptions' }, 
            value: { fieldName: 'New' },
            context: { fieldName: 'Id' }
        }
    },
    { label: 'Priority', fieldName: PRIORITY.fieldApiName, type: 'text' },
    { label: 'Origin', fieldName: ORIGIN.fieldApiName, type: 'text' }
];
 
export default class ServiceCaseQueueFiltered extends LightningElement {
    columns = COLUMNS;
    showSpinner = false;
    @track data = [];
    @track caseData;
    @track draftValues = [];
    lastSavedData = [];
    saveDraftValues = []
    @track pickListOptions;
 
    @wire(getObjectInfo, { objectApiName: CASE })
    objectInfo;
 
    @wire(getPicklistValues, {
        recordTypeId: "$objectInfo.data.defaultRecordTypeId",
        fieldApiName: CASE_STATUS
    })
    wirePickList({ error, data }) {
        if (data) {
            this.pickListOptions = data.values;
        } else if (error) {
            console.log(error);
        }
    }
 
    @wire(getUserCases, { pickList: '$pickListOptions' })
    generateCaseRows(result) {
        this.caseData = result;
        if (result.data) {
            this.data = JSON.parse(JSON.stringify(result.data));
 
            this.data.forEach(res => {
                res.pickListOptions = this.pickListOptions;
                res.caseNumberURL = '/' + res.Id;
                res.ownerName = res.Owner.Name;
            })
 
            this.lastSavedData = JSON.parse(JSON.stringify(this.data));
        } else if (result.error) {
            this.data = undefined;
        }
    };
 
    updateDataValues(updateItem) {
        let copyData = JSON.parse(JSON.stringify(this.data));
 
        copyData.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });
 
        this.data = [...copyData];
    }
 
    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = [...this.draftValues];
        
        copyDraftValues.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }
        });

        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
    }
 
    handleCellChange(event) {
        let draftValues = event.detail.draftValues;
        draftValues.forEach(ele=>{
            this.updateDraftValues(ele);
        })
    }
 
    handleSave(event) {
        this.showSpinner = true;
        this.saveDraftValues = this.draftValues;
 
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
 
        console.log(JSON.stringify(recordInputs));

        const promises = recordInputs.map(recordInput => updateRecord(recordInput).catch((error) => {console.log(error);}));

        console.log(JSON.stringify(promises));
        Promise.all(promises).then(res => {
            this.showToast('Success', 'Records updated successfully!', 'success', 'dismissable');
            this.draftValues = [];
            return this.refresh();
        }).catch(error => {
            console.log(error);
            this.showToast('Error', 'Error, can`t save data!', 'error', 'dismissable');
        }).finally(() => {
            this.draftValues = [];
            this.showSpinner = false;
        });
    }
 
    handleCancel(event) {
        this.data = JSON.parse(JSON.stringify(this.lastSavedData));
        this.draftValues = [];
    }
 
    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }
 
    async refresh() {
        this.showSpinner = true;
        await refreshApex(this.caseData);
        this.showSpinner = false;
    }
}