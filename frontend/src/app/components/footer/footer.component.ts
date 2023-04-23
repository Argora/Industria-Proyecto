import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  admin = false;
  closeResult = '';

  constructor(
    private router : Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    //comprobar sección de la pagina en que se encuentra
    this.router.events.subscribe((data:any)=>{
      //si es un modulo de admin, ocultar footer
      if(data.url){
        if(data.url == '/adminHome' ||data.url == '/adminProductos' ||data.url == '/adminUsuarios' ||data.url == '/bitacora'){
          //console.log('ocultar footer');
          //console.log(data.url)
          this.admin = true;
        }else{
          this.admin = false;
        }
      }
    });
  }

  //Modal
  open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}
  //Modal
  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

}
