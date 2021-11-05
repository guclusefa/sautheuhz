// validation formulaire bootstrap
(function () {
    'use strict';
    window.addEventListener('load', function () {
        var form = document.getElementById('needs-validation');
        form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    }, false);
})();

// formulaires dynamiques
var i = 1;
$(function () {
    $(document).on('click', '.btn-add', function (e) {
        e.preventDefault();
        i += 1

        var dynaForm = $('.formDynamique'),
            currentEntry = $(this).parents('.entry');
        newEntry = (currentEntry.clone()).appendTo(dynaForm);

        $("#compteur").attr("id", "compteur" + i);
        $("#compteur" + i).html(i-1);
        $("#compteur").attr("id", "compteur").html(i);

        newEntry.find('input').val('');
        dynaForm.find('.entry:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span>&times</span>');
    })

        .on('click', '.btn-remove', function (e) {
/*             i = i - 1
            $("#compteur").attr("id", "compteur").html(i); */
            $(this).parents('.entry:first').remove();

            e.preventDefault();
            return false;
        });
});

// https://github.com/jquery-validation/jquery-validation/tree/master/src/additional
// jQuery validate formulaire client
$(document).ready(function () {
    $('input[name="number"]').keyup(function (e) {
        if (/\D/g.test(this.value)) {
            // Filter non-digits from input value.
            this.value = this.value.replace(/\D/g, '');
        }
    });

    document.getElementById("inputTel").addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{2})/g, '$1 ').trim();
    })

    document.getElementById("inputSS").addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/^(.{1})(.{2})(.{2})(.{2})(.{3})(.{3})(.*)$/, "$1 $2 $3 $4 $5 $6");
    })

    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    });

    $.validator.addMethod("ville", function (value, element) {
        return this.optional(element) || /^[a-z0-9\-\s]+$/i.test(value);
    }, "Veuillez fournir seulement des lettres, nombres et espaces.");

    $("#client").validate({
        errorClass: "error fail-alert",
        validClass: "valid success-alert",
        rules: {
            inputNom: {
                minlength: 2,
                maxlength: 50,
                lettersonly: true,
                normalizer: function (value) {
                    // Update the value of the element
                    this.value = $.trim(value);
                    // Use the trimmed value for validation
                    return this.value;
                }
            },
            inputPrenom: {
                minlength: 2,
                maxlength: 50,
                lettersonly: true,
                normalizer: function (value) {
                    // Update the value of the element
                    this.value = $.trim(value);
                    // Use the trimmed value for validation
                    return this.value;
                }
            },
            inputEmail: {
                email: true,
                normalizer: function (value) {
                    // Update the value of the element
                    this.value = $.trim(value);
                    // Use the trimmed value for validation
                    return this.value;
                }
            },
            inputTel: {
                minlength: 14,
                maxlength: 14,
            },
            inputDate: {
                date: true,
                min: "1997-01-01",
                max: "2030-12-31"
            },
            inputVille: {
                minlength: 2,
                maxlength: 50,
                lettersonly: true,
                normalizer: function (value) {
                    // Update the value of the element
                    this.value = $.trim(value);
                    // Use the trimmed value for validation
                    return this.value;
                }
            },
            inputCp: {
                digits: true
            },
            inputAdresse: {
                minlength: 2,
                maxlength: 50,
                ville: true,
                normalizer: function (value) {
                    // Update the value of the element
                    this.value = $.trim(value);
                    // Use the trimmed value for validation
                    return this.value;
                }
            },
            inputSS: {
                minlength: 18,
                maxlength: 18,
            }
        }
    });
});

// jQuery validate formulaire connexion
$(document).ready(function () {
    $("#connexion").validate({
        errorClass: "error fail-alert",
        validClass: "valid success-alert",
        rules: {
            inputIdentifiant: {
                minlength: 2,
                maxlength: 50,
                nowhitespace: true,
                letterswithbasicpunc: true
            },
            inputPassword: {
                minlength: 5,
                maxlength: 50,
                nowhitespace: true
            }
        }
    });
});

// jQuery validate en français
$.extend($.validator.messages, {
    required: "Ce champ est obligatoire.",
    remote: "Veuillez corriger ce champ.",
    email: "Veuillez fournir une adresse électronique valide.",
    url: "Veuillez fournir une adresse URL valide.",
    date: "Veuillez fournir une date valide.",
    dateISO: "Veuillez fournir une date valide (ISO).",
    number: "Veuillez fournir un numéro valide.",
    digits: "Veuillez fournir seulement des chiffres.",
    creditcard: "Veuillez fournir un numéro de carte de crédit valide.",
    equalTo: "Veuillez fournir encore la même valeur.",
    notEqualTo: "Veuillez fournir une valeur différente, les valeurs ne doivent pas être identiques.",
    extension: "Veuillez fournir une valeur avec une extension valide.",
    maxlength: $.validator.format("Veuillez fournir au plus {0} caractères."),
    minlength: $.validator.format("Veuillez fournir au moins {0} caractères."),
    rangelength: $.validator.format("Veuillez fournir une valeur qui contient entre {0} et {1} caractères."),
    range: $.validator.format("Veuillez fournir une valeur entre {0} et {1}."),
    max: $.validator.format("Veuillez fournir une valeur inférieure ou égale à {0}."),
    min: $.validator.format("Veuillez fournir une valeur supérieure ou égale à {0}."),
    step: $.validator.format("Veuillez fournir une valeur multiple de {0}."),
    maxWords: $.validator.format("Veuillez fournir au plus {0} mots."),
    minWords: $.validator.format("Veuillez fournir au moins {0} mots."),
    rangeWords: $.validator.format("Veuillez fournir entre {0} et {1} mots."),
    letterswithbasicpunc: "Veuillez fournir seulement des lettres et des signes de ponctuation.",
    alphanumeric: "Veuillez fournir seulement des lettres, nombres, espaces et soulignages.",
    lettersonly: "Veuillez fournir seulement des lettres.",
    nowhitespace: "Veuillez ne pas inscrire d'espaces blancs.",
    ziprange: "Veuillez fournir un code postal entre 902xx-xxxx et 905-xx-xxxx.",
    integer: "Veuillez fournir un nombre non décimal qui est positif ou négatif.",
    vinUS: "Veuillez fournir un numéro d'identification du véhicule (VIN).",
    dateITA: "Veuillez fournir une date valide.",
    time: "Veuillez fournir une heure valide entre 00:00 et 23:59.",
    phoneUS: "Veuillez fournir un numéro de téléphone valide.",
    phoneUK: "Veuillez fournir un numéro de téléphone valide.",
    mobileUK: "Veuillez fournir un numéro de téléphone mobile valide.",
    strippedminlength: $.validator.format("Veuillez fournir au moins {0} caractères."),
    email2: "Veuillez fournir une adresse électronique valide.",
    url2: "Veuillez fournir une adresse URL valide.",
    creditcardtypes: "Veuillez fournir un numéro de carte de crédit valide.",
    ipv4: "Veuillez fournir une adresse IP v4 valide.",
    ipv6: "Veuillez fournir une adresse IP v6 valide.",
    require_from_group: $.validator.format("Veuillez fournir au moins {0} de ces champs."),
    nifES: "Veuillez fournir un numéro NIF valide.",
    nieES: "Veuillez fournir un numéro NIE valide.",
    cifES: "Veuillez fournir un numéro CIF valide.",
    postalCodeCA: "Veuillez fournir un code postal valide.",
    pattern: "Format non valide."
});