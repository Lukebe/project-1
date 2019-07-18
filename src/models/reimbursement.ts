export default class Reimbursement {
    public reimbursementId: number; // primary key
    public author: number;  // foreign key -> User, not null
    public amount: number;  // not null
    public dateSubmitted: string; // not null
    public dateResolved: string;
    public description: string; // not null
    public resolver: number; // foreign key -> User
    public status: number; // foreign ey -> ReimbursementStatus, not null
    public type: number; // foreign key -> ReimbursementType

    constructor(obj) {
      if (!obj) {
        return;
      }

      this.reimbursementId = obj.reimbursementid || obj.reimbursementId;
      this.author = obj.author;
      this.amount = obj.amount;
      this.dateSubmitted = obj.datesubmitted || obj.dateSubmitted;
      this.dateResolved = obj.dateresolved || obj.dateResolved;
      this.description = obj.description;
      this.resolver = obj.resolver;
      this.status = obj.status;
      this.type = obj.type;
    }
  }
