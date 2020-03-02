import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { forkJoin, Observable, pipe } from 'rxjs';
import { SearchSessions, Students } from '../types/api-output';
import { HttpRequestService } from './http-request.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private httpRequestService: HttpRequestService) {
  }

  searchAdmin(searchKey: string) {
    return forkJoin(
      {
        instrutors: this.getInstructors(searchKey),
        students: this.getStudents(searchKey),
        sessions: this.getSessions(searchKey),
        links: this.getLinks(searchKey),
        courses: this.getLinks(searchKey)
      }
    ).pipe(
      map(this.joinAdmin) 
    ) 
  }  

  // TODO
  //searchInstructor(searchKey: string) {
  //}

  private getStudents(searchKey: string): Observable<Students> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get("/search/students", paramMap);
  }

  private getInstructors(searchKey: string): Observable<Instructors> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
  }
  
  private getSessions(searchKey: string): Observable<SearchSessions> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get("/search/sessions", paramMap);
  }

  private getLinks(searchKey: string) {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get("/search/links", paramMap);
  }

  private getCourses(searchKey: string) {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get("/search/courses", paramMap);
  }

  /**
   * JoinAdmin defaults to using the email as the join key.
   */
  private joinAdmin(resp: {instructors: Instructors, students: Students, sessions: SearchSessions, courses: SearchCoursesData, links: SearchLinksData }): AdminSearchResult {
    // We use the students and instructors as the master fields 
    const { students } = resp.students; 
    const studentAccountSearchResults: StudentAccountSearchResult = [];
    for (let student of students) {
      const resp = { ...student }
    }
  }

  /**
   * JoinInstructor defaults to using the email as the join key.
   */
  //private joinInstructor() {
  //}
}

export interface AdminSearchResult {
  students: StudentAccountSearchResult[];
  instructors: InstructorAccountSearchResult[];
}

export interface StudentAccountSearchResult extends CommonAccountSearchResult {
  section: string;
  team: string;
  comments: string;
  recordsPageLink: string;
  openSessions: { [index: string]: string };
  notOpenSessions: { [index: string]: string };
  publishedSessions: { [index: string]: string };
}

export interface InstructorAccountSearchResult extends CommonAccountSearchResult {
}

export interface CommonAccountSearchResult {
  name: string;
  email: string;
  googleId: string;
  courseId: string;
  courseName: string;
  institute: string;
  courseJoinLink: string;
  homePageLink: string;
  manageAccountLink: string;
  showLinks: boolean;
}
