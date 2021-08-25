import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { RentedBook } from '../models/rentedBook';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  list: Array<Book>;
  filteredList: Array<Book>;
  rentedBooks: Array<RentedBook>;
  status: string;	//filter by status (eg. rented)

  //Modal variables
  username = "";
  membership = "";
  focusedId = -1;
  focusedTitle = ""; //Title of book selected by user
  rentalDuration: any;
  errorMsg = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
	this.status = this.route.snapshot.paramMap.get("status");
	this.initMockBooks();
  }
	
	/* BOOK OPERATIONS */
	rentBook(){
		//Input Validation
		let dur = parseFloat(this.rentalDuration);
		if(!dur || !(!isNaN(this.rentalDuration) && (dur | 0) === dur)){
			this.errorMsg = "Error: Rent Duration has to be a number";
			return;
		}
		if(this.username.length === 0){
			this.errorMsg = "Error: Username is empty";
			return;
		}
		if(this.membership.length === 0){
			this.errorMsg = "Error: Membership # is empty";
			return;
		}
		
		let retDate = new Date();
		retDate.setDate(retDate.getDate() + +this.rentalDuration);
		console.log(retDate);
		
		if(this.rentedBooks && 
			!this.rentedBooks.map(x => x.id).includes(this.focusedId)){
				this.rentedBooks.push({
					id: this.focusedId,
					rent_duration: this.rentalDuration,
					return_date: retDate,
					username: this.username,
					membership: this.membership});
			}
		localStorage.setItem('rented_list', JSON.stringify(this.rentedBooks));
		
		console.log(localStorage.getItem('rented_list'));
		
		this.closeModal();
		this.alertRental();
	}
	
	returnBook(){
		if(this.username.length === 0){
			this.errorMsg = "Error: Username is empty";
			return;
		}
		if(this.membership.length === 0){
			this.errorMsg = "Error: Membership # is empty";
			return;
		}
		let i = this.rentedBooks.map(x => x.id).indexOf(this.focusedId);
		if (i !== -1){
			if(this.rentedBooks[i].username === this.username &&
				this.rentedBooks[i].membership === this.membership){
					this.list = this.list.filter(x => x.id !== this.rentedBooks[i].id);
					this.filteredList = this.list;
					this.rentedBooks.splice(i, 1);
				}
			else{
				this.errorMsg = "Error: Invalid username or membership #";
				return;
			}
		}
			
		localStorage.setItem('rented_list', JSON.stringify(this.rentedBooks));
		this.closeModal();
		this.alertReturn();
	}

	/* SEARCH & FILTER */
	search_book(title: string){
		if(!title || title.length < 3){
			this.filteredList = this.list;
			return;
		}
		if(this.filteredList){
			this.filteredList = this.filteredList.filter(y => y.title.toLowerCase().includes(title.toLowerCase()));
		}
	}
	
	/* RENT/RETURN MODAL */
	openModal(id: number){
		let book = this.filteredList.find(x => x.id === +id);
		if(book){
			this.focusedId = book.id;
			this.focusedTitle = book.title;
		}
		let modal = document.getElementById("loginModal");
		modal.style.display = "block";
	}
	
	openModalReturn(id: number){
		let book = this.filteredList.find(x => x.id === +id);
		if(book){
			this.focusedId = book.id;
			this.focusedTitle = book.title;
		}
		let modal = document.getElementById("returnModal");
		modal.style.display = "block";
	}
	
	closeModal(){
		let modal = document.getElementById("loginModal");
		if(modal)
			modal.style.display = "none";
		modal = document.getElementById("returnModal");
		if(modal)
			modal.style.display = "none";
	}
	
	/* INITIALIZATION HELPERS */
	initMockBooks(){
		this.rentedBooks = JSON.parse(localStorage.getItem("rented_list"));
		if(!this.rentedBooks) this.rentedBooks = [];
		
		this.list = new Array();
		this.list.push({id:1, title:'The Wind\'s Twelve Quarters', author:'Ursula K. Le Guin', isbn:'221-1-45-854521-6', img_path:'assets/1.jpg', is_available: true});
		this.list.push({id:2, title:'The Testaments', author:'Margaret Atwood', isbn:'978-1-13-094231-8', img_path:'assets/2.jpg', is_available: true});
		this.list.push({id:3, title:'Shattered Bonds', author:'Faith Hunter', isbn:'431-8-37-376575-3', img_path:'assets/3.jpg', is_available: true});
		this.list.push({id:4, title:'The Lost Causes of Bleak Creek', author:'Rhett McLaughlin', isbn:'865-3-87-895456-5', img_path:'assets/4.jpg', is_available: true});
		this.list.push({id:5, title:'The Rise of Magicks', author:'Nora Roberts', isbn:'286-2-09-345333-6', img_path:'assets/5.jpg', is_available: true});
		this.list.push({id:6, title:'Ninth House', author:'Leigh Bardugo', isbn:'564-1-00-235522-3', img_path:'assets/6.jpg', is_available: true});
		this.list.push({id:7, title:'Dhalgren', author:'Samuel R. Delany', isbn:'745-1-84-234544-2', img_path:'assets/7.jpg', is_available: true});
		this.list.push({id:8, title:'The Secret - A Treasure Hunt', author:'Sean Kelly', isbn:'445-2-88-234588-1', img_path:'assets/8.jpg', is_available: true});
		this.list.push({id:9, title:'The Starless Sea', author:'Erin Morgenstern', isbn:'957-0-45-098977-1', img_path:'assets/9.jpg', is_available: true});
		this.list.push({id:10, title:'The Handmaid\'s Tale', author:'Margaret Atwood', isbn:'433-1-34-456772-0', img_path:'assets/10.jpg', is_available: true});
		
		let rentedIds = this.rentedBooks.map(x => +x.id);
		
		this.list.forEach(b => {
			if(rentedIds.includes(b.id)) {
				b.is_available = false;
			}
		});
		
		if(this.status === 'rented'){
			this.list = this.list.filter(x => x.is_available === false);
		}
		
		this.filteredList = this.list;
	}
	
	getDueDate(id: number){
		if(this.rentedBooks){
			let rb = this.rentedBooks.find(x => x.id == id);
			if(rb) return rb.return_date;
		}
	}
	
	alertRental(){
		alert('Book successfully rented!');
	}
	
	alertReturn(){
		alert('Book successfully returned!');
	}
}
