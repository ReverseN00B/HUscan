/* ------------------------------------------- */
/* javascript for its mobile services          */
/* --------------------------------------------*/
/* itsmobile, global variables */
var itsfocuscolor = "#FFF09E";
var itsfocuscolor_saved = "";
var itsfirstsend = true;

/* --- Mobile Form sendOnceCheck  ------------ */
function firstSend()
{
   /* looks like some industrial browsers have problems with sending */
   /* when software keyboard is open, therefor remove the focus from */
   /* input fields to the hidden input field. */
   window.focus();

   /* check against multiple send to WebAs */
   if ( !itsfirstsend )
     return false;   /* second send/submit --> ignore */

   /* this is the first send */
   itsfirstsend = false;

   /* re-enable the submit after 3 seconds */
   setTimeout('itsfirstsend = true', 3000);

   return true;
}

/* --- Mobile Form submit ---------------------*/
function submitOnce(params)
{
   if (params)
     document.forms["mobileform"].action += "?" + params;

   if ( firstSend() )
   {
      /* submit to WebAS */
      document.forms["mobileform"].submit();
   }
}

/* --- SET FOCUS BACKGROUND COLOR -------------*/
function changeBgColor(myfield, on_off)
{
   if ( myfield == null || myfield.style == null )
      return;
   if ( on_off )
   {
      /* background color on */
      itsfocuscolor_saved = myfield.style.backgroundColor;
      myfield.style.backgroundColor = itsfocuscolor;
   }
   else
   {
      /* background color off */
      myfield.style.backgroundColor = itsfocuscolor_saved;
   }
}

/* --- SET FOCUS ------------------------------*/
function setFocus(field)
{
   if ( field )
   {
      /* field names are in lower case */
      field = field.toLowerCase();
      var myfield = document.forms["mobileform"][field];
      if ( myfield )
      {
         if ( ( typeof(myfield.length) == "number" ) &&
              ( typeof(myfield.type) == "undefined" ) )
         {
            /* set focus for checkbox */
            myfield = document.forms["mobileform"][field][1];
            if ( !myfield ) return;
         }

         if ( !myfield.disabled )
         {
            /* set the focus */
            myfield.focus();
            if (typeof(myfield.select) == "object")
                myfield.select();
         }
      }
   }
}

/* --- SET FOCUS FIELD -------------------------*/
function setFocusField(field)
{
   focusField(field);

   var myfield = document.forms["mobileform"][field];
   if ( myfield && !myfield.disabled )
   {
      /* change background color on focus */
      changeBgColor(myfield, true);
   }
}

/* --- LEAVE FOCUS FIELD ----------------------*/
function leaveFocusField(field)
{
   var myfield = document.forms["mobileform"][field];
   if ( myfield && !myfield.disabled )
   {
      /* change background color back to default */
      changeBgColor(myfield, false);
   }
}

function focusField(field)
{
   document.forms["mobileform"]["~Focusfield"].value = field;
}

/* --- SEND OKCODE against WebAs --------------*/
function setOkCode(FCode)
{
  document.forms["mobileform"]["~OkCode"].value = FCode;
  submitOnce();
}

/* --- SEND FIELD INPUT AND OKCODE ENTER -------*/
function setOkCodeEnter()
{
  setOkCode("/0");
}

/* --- SEND FIELD INPUT AND OKCODE ENTER -------*/
function setFKey(fcode)
{
  document.forms["mobileform"]["~FKey"].value = fcode;
  setOkCodeEnter();
}

/* --- SEND FIELD INPUT AND OKCODE ENTER -------*/
function setOkCodeForF4(f4field)
{
  focusField(f4field);
  setFKey("4");
}

/* --- Search Help SCRIPTS -----------------*/
function shAction( action)
{
  document.forms["mobileform"].action = action;
  submitOnce();
}

function raiseEvent(control, event, params)
{
  if (typeof document.forms["mobileform"]["~Control"] != "undefined" &&
      typeof document.forms["mobileform"]["~Event"]   != "undefined") {
    document.forms["mobileform"]["~Control"].value = control ;
    document.forms["mobileform"]["~Event"].value = event;
    submitOnce(params);
  }
}

/* --- DEVICE SPECIFIC SCRIPTS -----------------*/
function processKeyEvent(event)
{
  var eventdone = false;

  /*     PREVENT Session Expired Page */
  if (event.keyCode == 8)
  {
    var d = event.srcElement || event.target;
    var tN = d.tagName.toLowerCase();
    if (tN == 'textarea' ||
        tN == 'input' && typeof d.type == 'string' &&
        (d.type.toLowerCase() == 'file' ||
         d.type.toLowerCase() == 'text' ||
         d.type.toLowerCase() == 'password')) {
      // Backspace is enabled in InputFields and TextAreas
      return true;
    }
    // Backspace is disabled on all other elements
    return false;
  }

  if ( event.ctrlKey )
  {
    /* ctrl and number: handle as function key */
    if (event.keyCode == 33)
    {
      /* Strg PageUp */
      setFKey(80);
      eventdone = true;
    }
    else if (event.keyCode == 34)
    {
      /* Strg PageDown */
      setFKey(83);
      eventdone = true;
    }
    else
    {
      eventdone = false;
    }
  }
  else if ( (event.keyCode >= 112) && (event.keyCode <= 123) )
  {
    if ( event.shiftKey == true )
    {
      /* F13 to F24 */
      setFKey(event.keyCode - 111 + 12);
      eventdone = true;
    }
    else
    {
      /* F1 to F12 */
      setFKey(event.keyCode - 111);
      eventdone = true;
    }
  }
  else if (event.keyCode == 33)
  {
    /* PAGE UP */
    setFKey(81);
    eventdone = true;
  }
  else if (event.keyCode == 34)
  {
    /* PAGE DOWN */
    setFKey(82);
    eventdone = true;
  }
  else if (event.keyCode == 35)
  {
    /* ENDE */
    setFKey(83);
    eventdone = true;
  }
  else if (event.keyCode == 36)
  {
    /* HOME */
    setFKey(80);
    eventdone = true;
  }
  else if (event.keyCode == 13)
  {
    /* ENTER */
    var d = event.srcElement || event.target;
    var tN = d.tagName.toLowerCase();
    if (tN == 'input' && typeof d.type == 'string' &&
        d.type.toLowerCase() == "button")
      d.click();
    else
      setOkCodeEnter();
    eventdone = true;
  }
  else
  {
    /* continue */
    eventdone = false;
  }

  if ( eventdone == true )
  {
    /* stop event bubbling */
    event.cancelBubble = true;
    event.returnValue = false;
    event.keyCode = 0;
    return false;
  }
  else
  {
    return true;
  }
}
