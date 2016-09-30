/* 
################    SUPER VALIDATION LIBRARY   #######################
    Usage :
    Usage is simple and straightforward. Just add the name of the rule to the data-walid of the field.
    Example :
    <input type="text" data-walid="required text"/>

---- Validation Rules ---
+ required -- Required field
+ text -- Must be text
+ number -- Must be numeric
+ dataIsValid -- Field is a valid date
+ min_N -- Value must be greater than given length(N)
+ max_N -- String must be less than given length(N)

*/
$(document).ready(function() {
    // Start validation at the moment of sending form
    $('form').on('submit', function(e) {
        e.preventDefault();
        var fields = $(this).find('input, textarea, select'); // get all controls
        var wynik = 0; // global input result -  if input return true wynik++
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i]; // form field
            var dataAttr = $(field).data('walid'); // attribute name field
            var attrName = dataAttr.split(' '); // separate validation rules
            var fieldValue = $(field).val(); // entered value
            var inputTab = []; // array with true false from  field
            var inputscore = 0; // attribute result - if attribute return true inputscore++
            for (j = 0; j < attrName.length; j++) {
                var validRule = attrName[j]; // get validation rule
                var ruleName = validRule.match(/[a-zA-Z]+/g); // only the name of the validation rule 
                start(fieldValue, ruleName, validRule);
                inputTab.push(start(fieldValue, ruleName, validRule, field)); // push true / false to array of validation rules 
                // condition if rule is true +1 to attribute result
                if (inputTab[j] === true) {
                    inputscore++;
                }
            }
            // condition - if all rules from inuput == true from attribute rule - +1 to global result of this field
            if (attrName.length == inputscore) {
                wynik++;
                $(field).removeClass('invalid'); // remove error class                 
                $(field).addClass('valid'); // add success class when input return true
                $(field).next('.inputErrorMsg').html(''); // remove message from error box
            } else {
                $(field).addClass('invalid'); // add error class when input return false
                $(field).removeClass('valid'); // remove success class
            }
        }
        // condition - if global result with true == all form inputs - send form
        if (wynik == fields.length) {
            this.submit();
        }
    });
    // function with validation rules
    function start(value, attr, ruleName, field) {
        var result = true;
        var regula = {
            required: function() {
                if (value == "") {
                    $('.blad').html('Wypełnij formularz');
                    return false;
                } else {
                    $('.blad').html('');
                    return true;
                };
            },
            text: function() {
                let reg = /^[a-zA-Z]+$/;
                if (!value.match(reg)) {
                    $(field).next('.inputErrorMsg').html('wprowadz tylko tekst');
                    return false;
                } else {
                    $(field).next('.inputErrorMsg').html('');
                    return true;
                };
            },
            number: function() {
                let stringTonumber = parseInt(value);
                if (isNaN(stringTonumber)) {
                    $(field).next('.inputErrorMsg').html('wprowadz numer');
                    return false;
                } else {
                    return true;
                };
            },
            dataIsValid: function() {
                var reg = /^\d{4}-\d{1,2}-\d{1,2}$/;
                if (!value.match(reg)) {
                    $(field).next('.inputErrorMsg').html('zly format daty yyyy-mm-dd');
                    return false;
                } else {
                    return true;
                };
            },
            urBoot: function() {
                var gsDayNames = new Array(
                    'niedziela',
                    'poniedzialek',
                    'wtorek',
                    'sroda',
                    'czwartek',
                    'piatek',
                    'sobota'
                );
                var d = new Date();
                var dayName = gsDayNames[d.getDay()];
                if (value == dayName) {
                    $(field).next('.inputErrorMsg').html('');
                    return true;
                } else {
                    $(field).next('.inputErrorMsg').html('wybierz dzisiejszy dzień');
                    return false;
                }
            },
            min: function() {
                let numb = ruleName.replace(/[^0-9]/g, '');
                if (value.length < numb) {
                    $(field).next('.inputErrorMsg').html('wprowadz min 3 znaki');
                    return false;
                } else {
                    return true;
                }
            },
            max: function() {
                let numb = ruleName.replace(/[^0-9]/g, '');
                if (value.length > numb) {
                    $(field).next('.inputErrorMsg').html('wprowadz max 15 znaków');
                    return false;
                } else {
                    return true;
                }
            }
        }
        process(regula[attr], regula);
        // condition - return true or false from valid rules
        if (process(regula[attr], regula) == false) {
            var result = false;
        }
        return result;
    }

    function process(callback, obj) {
        var result = true;
        if (callback('return') == true) {
            callback.call(obj, null);
            return true;
        } else {
            result = false;
            return result;
        }
        return result;
    }
});