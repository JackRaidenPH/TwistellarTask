public with sharing class ServiceCaseQueueService {
    @AuraEnabled(cacheable=true)
    public static List<Case> getUserCases() {
        List<QueueSobject> caseQueues = [SELECT Id, QueueId FROM QueueSobject WHERE SobjectType = 'Case' WITH USER_MODE];
        
        Map<Id, QueueSobject> queuesMap = new Map<Id, QueueSobject>(caseQueues);
        List<GroupMember> caseQueueMembers = [SELECT Id, UserOrGroupId FROM GroupMember WHERE GroupId IN :queuesMap.keySet() WITH USER_MODE];

        Map<Id, GroupMember> membersMap = new Map<Id, GroupMember>(caseQueueMembers);
        List<Case> result = [
            SELECT Id, CaseNumber, Owner.Name, Status, Priority, Origin
            FROM Case
            WHERE isOwnedByCurrentUser__c=TRUE OR OwnerId IN :membersMap.keySet()
            WITH USER_MODE
            ORDER BY isOwnedByCurrentUser__c DESC, numericPriority__c DESC, CreatedDate DESC
            LIMIT 25
        ];
        
        return result;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getCaseStatusTypes() {
        List<String> pickListValuesList= new List<String>();
         Schema.DescribeFieldResult fieldResult = Case.Status.getDescribe();
         List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
         
         for(Schema.PicklistEntry pickListVal : ple){
             pickListValuesList.add(pickListVal.getLabel());
         }  

         return pickListValuesList;
     }
}