function ContactCreate(storeName, dataEntity, co_client)
{
  var co_description  = $("#co_description").val();
  var co_type     = $("#co_type").val();

  var jsonCO =  {
          "client": co_client.replace("CL-",""),
          "description": co_description,
          "type": co_type
          };

  var urlCO = "http://api.vtexcrm.com.br/" + storeName + "/dataentities/" + dataEntity + "/documents/";

  $.ajax({
    headers: {
      "Accept": "application/vnd.vtex.ds.v10+json",
      "Content-Type": "application/json"
    },
    data: JSON.stringify(jsonCO),
    type: 'PATCH',
    url: urlCO,
    success: function (data) {
      console.log(data);
      ResetMessages()
      $("#co_message_success").show();
      $("#cl_first_name").val("");
      $("#corporateDocument").val("");
      $("#cl_email").val("");
      $("#cl_home_phone").val("");
      $("#stateRegistration").val("");
      $("#co_description").val("");
    },
    error: function (data) {
      console.log(data);
      ResetMessages()
      $("#co_message_error").show();
    }
  });
}

function ContactCreateByEmail(storeName, dataEntity, cl_email)
{
  var cl_url = "http://api.vtexcrm.com.br/" + storeName + "/dataentities/CL/search/?email=" + cl_email + "&_fields=id";

  $.ajax({
    headers: {
      "Accept": "application/vnd.vtex.ds.v10+json",
      "Content-Type": "application/json"
    },
    type: 'GET',
    url: cl_url,
    success: function(data, textStatus, xhr){
      console.log(data);
      if(xhr.status == "200" || xhr.status == "201"){
        ContactCreate(storeName, dataEntity, data[0].id);
      }else{
        ResetMessages()
        $("#co_message_error").show();
      }
    },
    error: function(data){
      console.log(data);
      ResetMessages()
      $("#co_message_error").show();
    }
  });
}

function ClientCreate()
{
  var storeName   = $("#master_data_store_name").val();
  var dataEntity    = $("#master_data_data_entity").val();

  var cl_first_name   = $("#cl_first_name").val();
  var corporateDocument   = $("#corporateDocument").val();
  var cl_email    = $("#cl_email").val();
  var cl_home_phone   = $("#cl_home_phone").val();
  var stateRegistration     = $("#stateRegistration").val();

  var cl_json =   {
          "firstName": cl_first_name,
          "corporateDocument": corporateDocument,
          "email": cl_email,
          "homePhone": cl_home_phone,
          "stateRegistration": stateRegistration
          };

  var cl_url = "http://api.vtexcrm.com.br/" + storeName + "/dataentities/CL/documents/";

  $.ajax({
    headers: {
      "Accept": "application/vnd.vtex.ds.v10+json",
      "Content-Type": "application/json"
    },
    data: JSON.stringify(cl_json),
    type: 'PATCH',
    url: cl_url,
    success: function(data, textStatus, xhr){
      console.log(data);
      if(xhr.status == "200" || xhr.status == "201"){
        ContactCreate(storeName, dataEntity, data.Id);
      }else if(xhr.status == "304"){
        ContactCreateByEmail(storeName, dataEntity, cl_email);
      }else{
        ResetMessages()
        $("#co_message_error").show();
      }
    },
    error: function(data){
      console.log(data);
      ResetMessages()
      $("#co_message_error").show();
    }
  });
}

function ResetMessages()
{
  $("#co_message_loading").hide();
  $("#co_message_validate").hide();
  $("#co_message_success").hide();
  $("#co_message_error").hide();
}

function IsEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function FormValidate()
{
  var isFormValidate = true;

  if($("#cl_first_name").val() == ""){
    isFormValidate = false;
    $("#cl_first_name").focus();
  }
  if((isFormValidate) && ($("#corporateDocument").val() == "")){
    isFormValidate = false;
    $("#corporateDocument").focus();
  }
  if((isFormValidate) && ($("#cl_email").val() == "")){
    isFormValidate = false;
    $("#cl_email").focus();
  }
  if((isFormValidate) && (!IsEmail($("#cl_email").val()))){
    isFormValidate = false;
    $("#cl_email").val("");
    $("#cl_email").focus();
  }
  if((isFormValidate) && ($("#cl_home_phone").val() == "")){
    isFormValidate = false;
    $("#cl_home_phone").focus();
  }
  if((isFormValidate) && ($("#stateRegistration").val() == "")){
    isFormValidate = false;
    $("#stateRegistration").focus();
  }
  if((isFormValidate) && ($("#co_description").val() == "")){
    isFormValidate = false;
    $("#co_description").focus();
  }

  if(isFormValidate){
    ResetMessages()
    $("#co_message_loading").show();
    ClientCreate();
  }else{
    ResetMessages()
    $("#co_message_validate").show();
  }

  // return false;
}

function FormCreate(storeName, dataEntity, htmlElementId, messageLoading, messageValidation, messageSuccess, messageError){
  var htmlContent = '';

  htmlContent += '<div id="co_message_loading" class="alert alert-info" style="display:none;">' + messageLoading + '</div>';
  htmlContent += '<div id="co_message_validate" class="alert alert-warning" style="display:none;">' + messageValidation + '</div>';
  htmlContent += '<div id="co_message_success" class="alert alert-success" style="display:none;">' + messageSuccess + '</div>';
  htmlContent += '<div id="co_message_error" class="alert alert-danger" style="display:none;">' + messageError + '</div>';
  htmlContent += '<form id="co_form" action="javascript:FormValidate();" method="post">';
  htmlContent += '<input type="hidden" id="master_data_store_name" name="master_data_store_name" value="' + storeName + '" />';
  htmlContent += '<input type="hidden" id="master_data_data_entity" name="master_data_data_entity" value="' + dataEntity + '" />';
  htmlContent += '<div class="form-field string required cl_first_name">';
  htmlContent +=    '<label for="cl_first_name">Nome</label>';
  htmlContent +=    '<input id="cl_first_name" maxlength="200" name="cl_first_name" type="text" />';
  htmlContent += '</div>';
  htmlContent += '<div class="form-field string required cl_email">';
  htmlContent +=    '<label for="cl_email">E-mail</label>';
  htmlContent +=    '<input id="cl_email" maxlength="300" name="cl_email" type="text">';
  htmlContent += '</div>';
  htmlContent += '<div class="form-field string required cl_home_phone">';
  htmlContent +=    '<label for="cl_home_phone">Telefone</label>';
  htmlContent +=    '<input id="cl_home_phone" maxlength="100" name="cl_home_phone" type="text" />';
  htmlContent += '</div>';
  htmlContent += '<div class="form-field string required co_type">';
  htmlContent +=    '<label for="co_type">Assunto</label>';
  htmlContent +=    '<select name="co_type" id="co_type">'
  htmlContent +=      '<option value="duvida">Tenho uma dúvida (que tal verificar o FAQ antes?)</option>'
  htmlContent +=      '<option value="desconto">Quero ser um franqueado</option>'
  htmlContent +=      '<option value="reclamacao">Reclamação sobre produtos</option>'
  htmlContent +=      '<option value="sugestao">Sugestões para o site</option>'
  htmlContent +=    '</select>'
  htmlContent += '</div>';
  htmlContent += '<div class="form-field string cl_assunto">';
  htmlContent +=    '<label for="cl_assunto">Assunto</label>';
  htmlContent +=    '<input id="cl_assunto" maxlength="100" name="cl_assunto" type="text" />';
  htmlContent += '</div>';
  htmlContent += '<div class="form-field string required co_description">';
  htmlContent +=    '<label for="co_description">Mensagem</label>';
  htmlContent +=    '<textarea id="co_description" name="co_description"></textarea>';
  htmlContent += '</div>';
  htmlContent += '<div class="form-field submit"><input id="commit" name="commit" type="submit" value="Enviar"></div>';
  htmlContent += '</form>';

  $("#"+htmlElementId).html(htmlContent);
}
