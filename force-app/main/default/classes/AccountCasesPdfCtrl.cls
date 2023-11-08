public without sharing class AccountCasesPdfCtrl {

    public List<Case> cases;

    public AccountCasesPdfCtrl() {   
        this.cases = AccountCasesPdfCtrl.getAccountCasesPrevWeek();
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getAccountCasesPrevWeek() {

        Date today = System.Today(); 
        Datetime prevWorkweekStart = today.toStartofWeek() - 7;
        Datetime prevWorkweekEnd = prevWorkweekStart + 4;

        List<Case> cases = [
            SELECT Account.Name, Account.Owner.Name, CaseNumber, Status, Priority, Origin
            FROM Case 
            WHERE CreatedDate >= :prevWorkweekStart AND CreatedDate <= :prevWorkweekEnd WITH USER_MODE
            ORDER BY AccountId
            ];
        
        return cases;
    }
}