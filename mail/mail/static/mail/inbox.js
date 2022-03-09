document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});




function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view-email').style.display = 'none';

  
  //Once submit button is clicked
  document.querySelector('#compose-form').onsubmit = function() {
  
    //collecting data to be submitted
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    //send request using fetch
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })

    .then(response => response.json())
    .then(result => {
      console.log(result);
    });

    
    load_mailbox('sent');
    return false
    
  }; 
  

 

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}
// 



function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      console.log(emails);
      if (emails.length === 0){
        document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
        document.querySelector('#emails-view').append('No messages');
      }
      else {
        let main_element = document.createElement('div');
        main_element.setAttribute('id', 'main-element')

        for (let i=0; i < emails.length; i++) {
          let element = document.createElement('div');
          element.setAttribute('class', 'border border-primary d-flex flex-row justify-content-between pt-2 pl-2 pr-2 m-1');
  
          let sub_element = document.createElement('p');
          sub_element.innerHTML = `<b>From:</b> ${emails[i].sender}`;
          element.append(sub_element);

          let sub_element0 = document.createElement('p');
          sub_element0.innerHTML = `<b>To:</b> ${emails[i].recipients}`;
          element.append(sub_element0);
  
          let sub_element1 = document.createElement('p');
          sub_element1.innerHTML = `<b>Subject:</b> ${emails[i].subject}`;
          element.append(sub_element1);
  
          let sub_element2 = document.createElement('p');
          sub_element2.setAttribute('class', 'text-muted small');
          sub_element2.innerHTML =`<em><b>${emails[i].timestamp}</b></em>`;
          element.append(sub_element2);

          if (emails[i].read === false) {
            element.style.backgroundColor = 'white';
          }else {
            element.style.backgroundColor = 'gray';
            sub_element2.setAttribute('class', 'small');
            sub_element.style.color = 'white';
            sub_element0.style.color = 'white';
            sub_element1.style.color = 'white';

          }
  
          main_element.append(element);

          element.addEventListener('click', () => {
          // Show the email and hide other views
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'none';
          document.querySelector('#view-email').style.display = 'block';
          document.querySelector('#view-email').innerHTML = '';

          fetch(`/emails/${emails[i].id}`, {
            method: 'PUT',
            body: JSON.stringify({
              read: true
            })
          })

          
          

          fetch(`/emails/${emails[i].id}`)
          .then(response => response.json())
          .then(email => {
            console.log(email);

            let mainElement = document.createElement('div');
            mainElement.setAttribute('class', 'pt-2')

            let replyButton = document.createElement('button');
            replyButton.innerHTML = 'Reply';
            replyButton.setAttribute('class', 'btn btn-sm btn-outline-primary')


            let archiveButton = document.createElement('button');
            archiveButton.innerHTML = 'Archive';
            archiveButton.setAttribute('class', 'float-right')

            let unarchiveButton = document.createElement('button');
            unarchiveButton.innerHTML = 'Unarchive';
            unarchiveButton.setAttribute('class', 'float-right')

            mainElement.append(archiveButton);
            mainElement.append(unarchiveButton);

            replyButton.style.display = 'none';
            archiveButton.style.display = 'none';
            unarchiveButton.style.display = 'none';


            if (mailbox === 'inbox') {
              archiveButton.style.display = 'block';

              archiveButton.addEventListener('click', () => {

                fetch(`/emails/${emails[i].id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                    archived: true
                  })
                })

                load_mailbox('inbox');


              })
             
            }else if (mailbox === 'archive') {
              unarchiveButton.style.display = 'block';

              unarchiveButton.addEventListener('click', () => {

                fetch(`/emails/${emails[i].id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                    archived: false
                  })
                })

                load_mailbox('inbox');


              })


            }

            let senderElement = document.createElement('p');
            senderElement.innerHTML = `<b>From:</b> ${email.sender}`;
            mainElement.append(senderElement);

            let recipientsElement = document.createElement('p');
            recipientsElement.innerHTML = `<b>To:</b> ${email.recipients}`;
            mainElement.append(recipientsElement);

            let subjectElement = document.createElement('p');
            subjectElement.innerHTML = `<b>Subject:</b> ${email.subject}`;
            mainElement.append(subjectElement);

            let timestampElement = document.createElement('p');
            timestampElement.innerHTML = `<b>Timestamp:</b> ${email.timestamp}`;
            mainElement.append(timestampElement);


            if (mailbox === 'inbox') {
              mainElement.append(replyButton);
              replyButton.style.display = 'block';

              replyButton.addEventListener('click', () => {

                // Show compose view and hide other views
                document.querySelector('#emails-view').style.display = 'none';
                document.querySelector('#compose-view').style.display = 'block';
                document.querySelector('#view-email').style.display = 'none';

                document.querySelector('#compose-recipients').value = emails[i].sender;
                document.querySelector('#compose-subject').value = `Re: ${emails[i].subject}`;
                document.querySelector('#compose-body').value = `On ${emails[i].timestamp} ${emails[i].sender} wrote: 
                >>"${emails[i].body}"`;

                //Once submit button is clicked
                document.querySelector('#compose-form').onsubmit = function() {
                
                  //collecting data to be submitted
                  const recipients = document.querySelector('#compose-recipients').value;
                  const subject = document.querySelector('#compose-subject').value;
                  const body = document.querySelector('#compose-body').value;

                  //send request using fetch
                  fetch('/emails', {
                    method: 'POST',
                    body: JSON.stringify({
                      recipients: recipients,
                      subject: subject,
                      body: body
                    })
                  })

                  .then(response => response.json())
                  .then(result => {
                    console.log(result);
                  });

                  
                  load_mailbox('sent');
                  return false
                  
                };                 

              })


            }


            let bodyElement = document.createElement('p');
            bodyElement.innerHTML = `<hr><br> ${email.body}`;
            bodyElement.setAttribute('class', 'pt-2');
            mainElement.append(bodyElement);


            document.querySelector('#view-email').append(mainElement);

          });
  


          });

        }
        document.querySelector('#emails-view').append(main_element);
        main_element.setAttribute('class', 'd-flex flex-column p-3');

        

      }

      return false
    
  
    

  });





}