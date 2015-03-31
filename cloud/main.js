//var Mandrill = require('mandrill');
//Mandrill.initialize('cuj1wYwWxH25Dti8otmvdA');

Parse.Cloud.define("sendMail", function(request, response) {

  Parse.Cloud.httpRequest({ method: 'POST', headers: {
  'Content-Type': 'application/json; charset=utf-8'
  }, url: 'https://mandrillapp.com/api/1.0/messages/send.json', body: {

  key: "cuj1wYwWxH25Dti8otmvdA",
  message: {
    html: "Bonjour !<br><br>Merci d’avoir joué avec nous au jeu du forum ASI du comité de l’offre Mobilité !<br><br>Votre score est de : <b>" + request.params.score + "</b><br><br>·   Entre 0 et 20 points – niveau Débutant : vous découvrez le sujet mais montez en compétences rapidement ! N’oubliez pas de suivre les REX des missions Mobilité et de lire les articles Insight se rapportant au sujet !<br><br>·  Entre 20 et 40 points – niveau Initié : vous en savez juste assez pour repérer un donneur d’ordre pertinent ou un besoin lié à la Mobilité dans l’environnement de vos missions ! Ça tombe bien, n’hésitez pas à nous remonter ce type d’info !<br><br>·         Entre 40 et 50 points – niveau Expert : vous maîtrisez les grands messages de l’offre Mobilité ! Félicitations !<br><br>Pour retrouver les supports de l’offre présenté au forum, suivez ce lien : W:\/Interne\/Espace-Practices\/Practice ASI\/BL UWS\/Offres\/3. Mobilité\/Forum !<br><br>Pour retrouver les articles Insight liés au sujet, suivez ce <a href='http:\/\/www.solucominsight.fr\/2014\/09\/mobile-application-management-quel-interet-les-entreprises/'>lien</a> !<br><br>Bonne journée,<br><br>Le Comité de l’Offre Mobilité",
    subject: "Offre mobilité",
    from_email: "offre.mobilite@solucom.fr",
    from_name: "Offre Mobilité Solucom",
    to: [
      {
        email: request.params.email,
        name: request.params.username
      }
    ]
  }
  }, success: function(httpResponse) {
    console.log(httpResponse);
  }, error: function(httpResponse) {
    console.error(httpResponse);
  } });

  /*Mandrill.sendEmail({
    message: {
      key: "1",
      text: "Bonjour !\nMerci d’avoir joué avec nous au jeu du forum ASI du comité de l’offre Mobilité !\nVotre score est de : " + request.params.score + "\n·         Entre 0 et 20 points – niveau stagiaire : vous découvrez le sujet mais montez en compétences rapidement ! N’oubliez pas de suivre les REX des missions Mobilité et de lire les articles Insight se rapportant au sujet !\n·         Entre 20 et 40 points – niveau consultant : vous en savez juste assez pour repérer un donneur d’ordre pertinent ou un besoin lié à la Mobilité dans l’environnement de vos missions ! Ça tombe bien, n’hésitez pas à nous remonter ce type d’info !·         Entre 40 et 60 points – niveau manager : vous maîtrisez les grands messages de l’offre Mobilité ! Félicitations !\nPour retrouver les supports de l’offre présenté au forum, suivez ce lien : xxxxx !\nPour retrouver les articles Insight liés au sujet, suivez ce lien !\nBonne journée,\nLe Comité de l’Offre Mobilité ",
      subject: "Offre mobilité",
      from_email: "offre.mobilite@solucom.fr",
      from_name: "Offre Mobilité Solucom",
      to: [
        {
          email: "edmbayen@gmail.com",//request.params.email,
          name: "test"
        }
      ]
    },
    async: true
  },{
    success: function(httpResponse) {
      console.log(httpResponse);
      response.success("Email sent!");
    },
    error: function(httpResponse) {
      console.error(httpResponse);
      response.error("Uh oh, something went wrong");
    }
  });*/
});
