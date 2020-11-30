import {Component, OnInit} from '@angular/core';
import {AgentRequestToReview} from '../models/agent-request-to-review.model';
import {AgentServiceService} from '../agent-service.service';
import {RequestGetAgentRequests} from '../models/request-get-agent-requests.model';
import {RequestReviewRequest} from '../models/request-review-request.model';
// import {ReviewValue} from '../models/review-value.model';
import {RequestAdminNote} from '../models/request-admin-note.model';
import {RequestPersonalNote} from '../models/request-personal-note.model';
import {History} from '../../../donation-history/history.model';

@Component({
  selector: 'app-agent-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  //start : new
  buttonReview = false;
  buttonReject = false;
  buttonAccept = false;
  buttonActive = false;
  buttonDetials = false;
  //end : new

  searchKey: string;
  searchByColumn = 'username';
  total = 0;
  startRequests = 0;
  perPage = 10;
  pageNumber = 0;
  phoneNumber = '';

  requestID: string;
  adminNote: string;
  personalNote: string;

  agentRequestsToReview: AgentRequestToReview[] = new Array();
  // rivewValue: ReviewValue = new ReviewValue();

  constructor(private agentService: AgentServiceService) {
  }

  ngOnInit() {
    this.searchKey = '';
    this.getAgentRequestsToReview();
  }

  public getAgentRequestsToReview() {
    var finalSearchKey = '%' + this.searchKey + '%';
    const agentSearch: RequestGetAgentRequests = new RequestGetAgentRequests(
      this.startRequests.toString(), this.perPage.toString(), this.searchByColumn, finalSearchKey, '0');
    console.log(agentSearch);
    this.agentRequestsToReview = [];
    this.agentService.getAgentRequestsToReview(agentSearch).subscribe(res => {
        console.log('res : ' + res);
        for (const key in res) {
          var artr = new AgentRequestToReview();

          // artr.addressPermanent = res[key]['addressPermanent'];
          // artr.addressPresent = res[key]['addressPresent'];

          artr.gender = res[key]['gender'];
          artr.name = res[key]['name'];
          artr.noteApplicant = res[key]['noteApplicant'];
          artr.noteAdmin = res[key]['noteAdmin'];
          artr.notePersonal = res[key]['notePersonal'];
          //clean
          console.log(res[key]['notePersonal']);


          // artr.phone_number = res[key]['phone_number'];
          artr.phone_number = '';
          for (const phoneKey in res[key]['phone_number']) {
            artr.phone_number += res[key]['phone_number'][phoneKey]['number'] + ';\n';
            console.log(res[key]['phone_number'][phoneKey]['number']);
          }
          // console.log(artr.phone_number);
          // console.log(res[key]['phone_number']);
          // console.log(res[key]['addressList']);
          // console.log(res[key]['addressList']['0']['type']);
          for (const addrKey in res[key]['addressList']) {
            if (res[key]['addressList'][addrKey]['type'] === 'PRESENT') {
              // type = 'PRESENT'
              artr.presentDist = res[key]['addressList'][addrKey]['district'];
              artr.presentDiv = res[key]['addressList'][addrKey]['division'];
              artr.presentId = res[key]['addressList'][addrKey]['addressID'];
              artr.presentStreet = res[key]['addressList'][addrKey]['street_address'];
              artr.presentUnion = res[key]['addressList'][addrKey]['union_ward'];
              artr.presentUpz = res[key]['addressList'][addrKey]['upzilla'];
            } else {
              artr.permanentDist = res[key]['addressList'][addrKey]['district'];
              artr.permanentDiv = res[key]['addressList'][addrKey]['division'];
              artr.permanentId = res[key]['addressList'][addrKey]['addressID'];
              artr.permanentStreet = res[key]['addressList'][addrKey]['street_address'];
              artr.permanentUnion = res[key]['addressList'][addrKey]['union_ward'];
              artr.permanentUpz = res[key]['addressList'][addrKey]['upzilla'];
            }
          }

          artr.profession = res[key]['profession'];
          artr.profileId = res[key]['profileId'];
          artr.requestDate = res[key]['requestDate'];
          // artr.requestId = res[key]['requestId'];
          artr.requestId = res[key]['id'];
          artr.status = res[key]['status'];
          artr.userId = res[key]['userId'];
          artr.username = res[key]['username'];

          this.agentRequestsToReview.push(artr);
        }
      }
    );
    // console.log(this.agentRequestsToReview);
    this.agentService.getAgentRequestsToReviewCount(agentSearch).subscribe(res => {
        console.log(res);
        this.total = res['COUNT'];
      }
    );
  }

  public nextPage() {
    if (this.startRequests <= this.total) {
      this.startRequests += this.perPage;
      this.getAgentRequestsToReview();
    }
  }

  public previousPage() {
    if (this.startRequests > 0) {
      this.startRequests -= this.perPage;
      this.getAgentRequestsToReview();
    }
  }

  public requestReject(requestIdReject: string) {
    const reviewRequestReject: RequestReviewRequest = new RequestReviewRequest(requestIdReject, this.rivewValue.REJECT);
    this.agentService.requestReview(reviewRequestReject).subscribe(res => {
      console.log(res);
      if (res['STATUS'] === 'OK') {
        // this.getAgentRequestsToReview();
        var artr: AgentRequestToReview = this.agentRequestsToReview.find(({requestId}) => requestId === requestIdReject);
        this.agentRequestsToReview = this.agentRequestsToReview.filter(obj => obj !== artr);
        this.total -= 1;
      }
    });
  }

  public

  requestAccept(requestIdAccept
                  :
                  string, value
                  :
                  string
  ) {
    const reviewRequestAccept: RequestReviewRequest = new RequestReviewRequest(requestIdAccept, value);
    // console.log(requestId);
    console.log(reviewRequestAccept);
    this.agentService.requestReview(reviewRequestAccept).subscribe(res => {
      console.log(res);
      if (res['STATUS'] === 'OK') {
        // this.getAgentRequestsToReview();
        // var hist: History = this.historyDonation.find(({id}) => id === this.deleteId);
        var artr: AgentRequestToReview = this.agentRequestsToReview.find(({requestId}) => requestId === requestIdAccept);
        this.agentRequestsToReview = this.agentRequestsToReview.filter(obj => obj !== artr);
        this.total -= 1;
      }
    });
  }

  public

  requestHold(requestIdHold
                :
                string, HOLD
                :
                string
  ) {
    const reviewRequestHold: RequestReviewRequest = new RequestReviewRequest(requestIdHold, HOLD);
    this.agentService.requestReview(reviewRequestHold).subscribe(res => {
      console.log(res);
      if (res['STATUS'] === 'OK') {
        // this.getAgentRequestsToReview();
        var artr: AgentRequestToReview = this.agentRequestsToReview.find(({requestId}) => requestId === requestIdHold);
        this.agentRequestsToReview = this.agentRequestsToReview.filter(obj => obj !== artr);
        this.total -= 1;
      }
    });
  }


  public

  updateAdminNote() {
    const adminNote = new RequestAdminNote(this.requestID, this.adminNote);
    console.log(adminNote);
    this.agentService.updateAdminNote(adminNote).subscribe(res => {
      console.log(res);
      if (res['STATUS'] === 'OK') {
        this.getAgentRequestsToReview();
      }
    });
  }

  public

  updatePersonalNote() {
    const personalNoteObj = new RequestPersonalNote(this.requestID, this.personalNote);
    console.log(personalNoteObj);
    this.agentService.updatePersonalNote(personalNoteObj).subscribe(res => {
      console.log(res);
      if (res['STATUS'] === 'OK') {
        this.getAgentRequestsToReview();
      }
    });
  }


}
