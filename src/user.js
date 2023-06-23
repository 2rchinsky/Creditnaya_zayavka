import * as $ from "jquery";
import IMask from "imask/esm/imask"; // imports only factory
import "imask/esm/masked/number";
import Datepicker from "vanillajs-datepicker/Datepicker";
import ru from "vanillajs-datepicker/locales/ru";
require("selectize");
require("suggestions-jquery");

///////////////////////DATE///////////////////////////////////////////////
Object.assign(Datepicker.locales, ru);

function subtractYears(numOfYears, date = new Date()) {
  date.setFullYear(date.getFullYear() - numOfYears);

  return date;
}

const elem = document.querySelector('input[name="date"]');
const datepicker = new Datepicker(elem, {
  language: "ru",
  format: "dd.mm.yyyy",
  showOnFocus: false,
  showOnClick: false,
  autohide: true,
  maxDate: subtractYears(25, new Date()),
});
document.getElementById("date") &&
  IMask(document.getElementById("date"), {
    mask: Date,
    lazy: false,
    blocks: {
      d: {
        mask: IMask.MaskedRange,
        placeholderChar: "Д",
        from: 1,
        to: 31,
        maxLength: 2,
      },
      m: {
        mask: IMask.MaskedRange,
        placeholderChar: "М",
        from: 1,
        to: 12,
        maxLength: 2,
      },

      Y: {
        mask: IMask.MaskedRange,
        max: 2000,
        placeholderChar: "Г",
        from: 1900,
        to: 2222,
        maxLength: 4,

        validate: (value) => {
          if (value.length === 1 && value !== "1") {
            return false;
          }
          if (value.length === 2 && value !== "19") {
            return false;
          }
        },
      },
    },
    validate: (value, masked) => {
      if (value.length === 10) {
        clearError("#date");
      }
      // console.log(masked);
    },
  });
elem.addEventListener("changeDate", (event) => {
  clearError("#date");
});

//////////////////////////////////////////

$(document).ready(function () {
  $("select").selectize({
    sortField: "text",
    onChange: function (value) {
      if (value) {
        $("#select-reg")
          .parent()
          .find(".form_label")
          .removeClass("_errorLabel");
        $("#select-reg").parent().find(".full").removeClass("_error");
      }
    },
  });
});
const form_svg = document.getElementById("form_svg");
form_svg &&
  form_svg.addEventListener(
    "click",
    function () {
      datepicker.show();
    },
    false
  );

let surname, name, patronymic, gender;

$(".suggestions-input").suggestions({
  token: "7cabccd0c7d471b01ef1c698155034c049825d9a",
  type: "NAME",
  /* Вызывается, когда пользователь выбирает одну из подсказок */
  onSelect: function (suggestion) {
    surname = suggestion.data.surname;
    name = suggestion.data.name;
    patronymic = suggestion.data.patronymic;
    localStorage.setItem("gender_id", suggestion.data.gender.toLowerCase())
    // defaultSelect(suggestion.data.gender)
    if (surname && name && patronymic) {
      clearError(".suggestions-input");
    }

  },
});

$("#email").suggestions({
  token: "7cabccd0c7d471b01ef1c698155034c049825d9a",
  type: "EMAIL",
  /* Вызывается, когда пользователь выбирает одну из подсказок */
  onSelect: function (suggestion) {
    // console.log(suggestion);
  }
});

const gender_id = document.getElementById("gender_id")
function defaultSelect(gender) {
  const mySelect = document.getElementById('gender_id');

  for (let i, j = 0; i = mySelect.options[j]; j++) {
    if (i.value == gender) {
      mySelect.selectedIndex = j;
      break;
    }
  }
}

gender_id && defaultSelect(localStorage.getItem("gender_id"))
var phone = document.getElementById("phone");
var maskOptions = {
  mask: "+{7}(000)000-00-00",
  lazy: false, // make placeholder always visible
  validate: (value) => {
    if (value.length === 16) {
      clearError("#phone");
    }
  },
};
phone && IMask(phone, maskOptions);

/////////////////////////////RANGE-SLIDER///////////////////////

function loan(arg) {
  const parent = document.querySelector(arg);
  if (!parent) {
    return;
  }

  const rangeS = parent.querySelectorAll('input[type="range"]'),
    numberS = parent.querySelectorAll('input[type="number"]');

  rangeS.forEach((el) => {
    el.oninput = () => {
      numberS[0].value = parseFloat(rangeS[0].value);
    };
  });

  numberS.forEach((el) => {
    el.onkeyup = () => {
      const min = Number(numberS[0].getAttribute("min"));
      const max = Number(numberS[0].getAttribute("max"));
      const value = Number(numberS[0].value);

      if (value >= min && value <= max) {
        rangeS[0].value = isNaN(parseInt(value, 10)) ? 0 : parseInt(value, 10);
      }
    };
  });
}

loan(".range-loan-sum");
loan(".range-loan-term");

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");

  form && form.addEventListener("submit", formSend);

  // console.log("DOMContentLoaded"); //чекаем что это выполняется после загрузки дома

  async function formSend(e) {
    e.preventDefault();

    let error = formValidate(form);
    const buttonSubmit = document.querySelector(".form_send");
    let formData = new FormData(form);
    const arrayDate = formData.get("date").split(".");

    const error_page = form.getAttribute("data-page-error");
    const success_page = form.getAttribute("data-page-success");

    formData.append("first_name", name);
    formData.append("last_name", surname);
    formData.append("fath_name", patronymic);
    formData.append("birthDay", arrayDate[0]);
    formData.append("birthMonth", arrayDate[1]);
    formData.append("birthYear", arrayDate[2]);
    formData.append("metric", window.location.search);
    // formData.append("success_page", success_page);

    if (error === 0) {
      localStorage.setItem('FormData', JSON.stringify(Object.fromEntries(formData)));
      window.location.href = "/completion.html"
      // buttonSubmit.disabled = true;
      // $("#wrap_loader").show();
      // let response = await fetch("https://creditzayavka.ru/api_credit.php", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(Object.fromEntries(formData)),
      // })
      //   .catch((error) => {
      //     console.log(error);
      //   })
      //   .finally(() => {
      //     $("#wrap_loader").hide();
      //   });
      // if (response) {
      //   let result = await response.json(); //https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch вот тут описание что ещё есть кроме text() и json()
      //   buttonSubmit.disabled = false;

      //   if (result?.status && result.status === "approve") {
      //     // form.reset();
      //     window.open(
      //       `https://${window.location.hostname}/${success_page}.html`,
      //       "_self" // <- This is what makes it open in a same window.
      //     );
      //   } else {
      //     window.open(
      //       `https://${window.location.hostname}/${error_page}.html?reson=${result.reason}`,
      //       "_self" // <- This is what makes it open in a same window.
      //     );
      //   }
      // } else {
      //   buttonSubmit.disabled = false;
      //   window.open(
      //     `https://${window.location.hostname}/${error_page}.html?reson=${result.reason}`,
      //     "_blank" // <- This is what makes it open in a new window.
      //   );
      // }
    } else {
      // alert("Ошибка в заполнении");
    }
  }
  function formValidate(form) {
    // console.log(form); //чекаем какая форма приходит
    let error = 0;
    let formReq = form.querySelectorAll("._req");

    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input);

      if (input.classList.contains("_name")) {
        if (input.value && validateName(input)) {
          formAddError(input, "Поле не должно содержать латиницу и цифр");
          error++;
        } else {
          if (!name || !surname || !patronymic) {
            const objectFIO = {
              имя: name,
              фамилию: surname,
              отчество: patronymic,
            };
            const errorPartsFIO = [];

            for (var key in objectFIO) {
              if (!objectFIO[key]) {
                errorPartsFIO.push(key);
              }
            }

            formAddError(input, `Введите  ${errorPartsFIO.join(", ")}`);
            error++;
          }
        }
      } else if (input.classList.contains("_phone")) {
        if (validatePhone(input)) {
          formAddError(input);
          error++;
        }
      } else if (input.classList.contains("_date")) {
        if (validateDate(input)) {
          formAddError(input);
          error++;
        }
      } else if (
        input.getAttribute("type") === "checkbox" &&
        input.checked === false
      ) {
        formAddError(input);
        error++;
      } else {
        if (input.value === "") {
          formAddError(input);
          document
            .getElementsByClassName("not-full")[0]
            .classList.add("_error");
          error++;
        }
      }
    }
    return error;
  }

  function formAddError(input, text = "") {
    const inputPreviousSibling = input.previousSibling;
    inputPreviousSibling && inputPreviousSibling.classList.add("_errorLabel");
    input.classList.add("_error");
    const helper = input.parentElement.querySelector("span.helper-text");
    if (text) {
      helper.innerHTML = text;
    }
    helper && helper.classList.add("show");
  }

  function formRemoveError(input) {
    const inputPreviousSibling = input.previousSibling;
    const hasClas =
      inputPreviousSibling &&
      inputPreviousSibling.classList.contains("_errorLabel");
    hasClas && inputPreviousSibling.classList.remove("_errorLabel");
    const helper = input.parentElement.querySelector("span.helper-text");
    helper && helper.classList.remove("show");
    input.classList.remove("_error");
    input.parentElement
      .getElementsByClassName("full")[0]
      ?.classList.remove("_error");
  }

  function validateName(input) {
    return /([a-z])|(\d)/gim.test(input.value);
  }

  function validatePhone(input) {
    return !/^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(
      input.value
    );
  }

  function validateDate(input) {
    // console.log(input.value);
    return !/^([0-9]{2})\.([0-9]{2})\.([0-9]{4})$/.test(input.value);
  }
});

let body = document.body;

let closePopupButton = document.querySelectorAll(".close_popup");
let openPopupButtonSecondary = document.getElementById("open_popup2");
let openPopupButton = document.getElementById("open_popup1");
let popup2 = document.getElementById("popup2");
let popup1 = document.getElementById("popup1");
openPopupButtonSecondary &&
  openPopupButtonSecondary.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.add("modal_active");
    popup2.classList.add("active");
  });
openPopupButton &&
  openPopupButton.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.add("modal_active");
    popup1.classList.add("active");
  });
///formAgreement///
const formAgreement = document.getElementById("formAgreement");
formAgreement &&
  formAgreement.addEventListener("change", function () {
    if (this.checked) {
      clearError("#formAgreement");
    }
  });
///formAgreement///
closePopupButton.forEach((button) => {
  button.addEventListener("click", () => {
    document.body.classList.remove("modal_active");
    popup1.classList.remove("active");
    popup2.classList.remove("active");
  });
});
const anchors = document.querySelectorAll('a[href*="#"]');

for (let anchor of anchors) {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const blockID = anchor.getAttribute("href").substr(1);

    blockID &&
      document.getElementById(blockID).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  });
}

function clearError(text) {
  $(text).removeClass("_error");
  $(text).parent().find(".form_label").removeClass("_errorLabel");
  $(text).parent().find(".helper-text").removeClass("show");
}

(function ($) {
  if (typeof $ !== "undefined") {
    window.inputSliderRange = {
      active: false,
      themes: {},
      addTheme: function (name, objectSettings) {
        this.themes[name] = objectSettings;
      },
      getTheme: function (name) {
        return this.themes[name] !== undefined ? this.themes[name] : {};
      },
    };
  }

  let isMobile = is_touch_device(),
    events = {
      move: isMobile ? "touchmove" : "mousemove",
      end: isMobile ? "touchend" : "mouseup",
      start: isMobile ? "touchstart" : "mousedown",
    };

  function changePositionByDragMouse(event, endDrag = false) {
    let config = window.inputSliderRange.active,
      leftMouse = isMobile
        ? endDrag
          ? event.originalEvent.changedTouches[0].pageX
          : event.originalEvent.touches[0].pageX
        : event.pageX,
      rectangle = config.self[0].getBoundingClientRect(),
      leftBool = rectangle.left <= leftMouse,
      rightBool = rectangle.right > leftMouse;

    if (leftBool && rightBool) {
      let left = Math.round(leftMouse - rectangle.left);
      setTo(
        config.self,
        left / (rectangle.width / 100),
        true,
        false,
        endDrag,
        true,
        1
      );
    } else {
      setTo(config.self, !leftBool ? 0 : 100, true, false, endDrag, true, 1);
    }
  }

  $(document)
    .on(events.move, function (event) {
      if (
        window.inputSliderRange.active &&
        typeof window.inputSliderRange.active === "object"
      ) {
        //alert('touch start');
        changePositionByDragMouse(event);
      }
    })
    .on(events.end, function (event) {
      if (
        window.inputSliderRange.active &&
        typeof window.inputSliderRange.active === "object"
      ) {
        changePositionByDragMouse(event, true);
        window.inputSliderRange.active.elements.parent.removeClass("dragged");
        window.inputSliderRange.active.follow = false;
        window.inputSliderRange.active = false;
      }
    });

  function getBaseConfig() {
    return {
      min: 0,
      max: 100,
      start: 50,
      step: 1,
      delay: 0,
      onInitialize: false,
      onInitialized: false,
      onChange: false,
      onChanged: false,
      grid: false,
      gridSuffix: "",
      gridCompression: false,
      gridCompressionPercent: 10,
      gridCompressionValues: {
        "-9999999": { text: "", compression: 0, digits: 0 },
        1000: { text: "тыс.", compression: 3, digits: 0 },
        1000000: { text: "млн", compression: 6, digits: 1 },
        1000000000: { text: "млрд", compression: 9, digits: 1 },
      },
      gridInwardly: false,
      thumb: false,
      startCheckValueInput: true,
      classes: {
        parent: [],
        input: [],
      },
      theme: false,
      disabled: false,
      stepRoundOnInput: true,
      startNumbStepping: false,
    };
  }

  let methods = {
    init: function (options) {
      return this.each(function () {
        let $this = $(this),
          data = $this.data("inputSliderRange"),
          val = $this.val(),
          attrConfig = getConfigFromAttr($this),
          theme =
            typeof attrConfig.theme !== "undefined"
              ? attrConfig.theme
              : options.theme,
          themeConfig = window.inputSliderRange.getTheme(theme);

        let settings = $.extend(
          true,
          {},
          getBaseConfig(),
          themeConfig,
          options,
          attrConfig
        );

        if (typeof data === "undefined") {
          callCallbackConfig(settings.onInitialize, {});
          generateEvents($this[0], "inputSliderRange_initialize");

          if (settings.startCheckValueInput && validateInput(val)) {
            settings.start = removeReplace(val);
          }

          let current = calculateCurrentValue(
            settings.start,
            settings.min,
            settings.max
          );

          $this.data("inputSliderRange", {
            self: $this,
            follow: false,
            settings: settings,
            current: current,
            currentOld: false,
            lastInput: current,
            timer: false,
            elements: {},
          });

          let config = getConfig($this);
          $this.val(config.current);

          constructor($this, config);

          $this
            .on("keydown", function (e) {
              let k = e.which || e.button;
              if (e.ctrlKey && (k === 86 || k === 88)) return false;
            })
            .on("input", function () {
              let value = $(this).val();

              if (!validateInput(value) && value !== "") {
                $(this).val(config.lastInput);
                return false;
              } else {
                if (value !== "") {
                  config.lastInput = value;
                }
              }
            })
            .on("focus", function () {
              $this.val(removeReplace(config.current));
            })
            .on("blur", function () {
              setTo($(this), $(this).val(), false, true, true, true, 2);
            });

          config.elements.handler.on(events.start, function () {
            config.follow = true;
            config.elements.parent.addClass("dragged");
            window.inputSliderRange.active = config;
          });

          config.elements.goto.on("click", function (event) {
            let percent =
              event.offsetX / (this.getBoundingClientRect().width / 100);

            setTo($this, percent, true, false, true, true, 0);
          });

          setTo($this, config.current, false, true, true, true, 2);
          toggleGridInwardly(config);

          callCallbackConfig("onInitialized", config);
          generateEvents(
            config.self[0],
            "inputSliderRange_initialized",
            generateOutputInfoToEvent(config)
          );

          checkDisabledConfigAndSet($this, settings);
        }
      });
    },
    setTo: function (toCount, percentage = false, runEvents = true) {
      return this.each(function () {
        setTo($(this), toCount, percentage, true, true, runEvents, 2);
      });
    },
    update: function (options, runEvents = true) {
      return this.each(function () {
        let config = getConfig($(this)),
          settings = jQuery.extend(
            true,
            getBaseConfig(),
            window.inputSliderRange.getTheme(options.theme),
            config.settings,
            options
          );
        config.settings = settings;
        config.settings.current = calculateCurrentValue(
          settings.start,
          settings.min,
          settings.max
        );

        grid(config);
        thumb(config);
        toggleGridInwardly(config);
        checkDisabledConfigAndSet($(this), settings);

        methods.setTo.call(
          config.self,
          config.settings.current,
          false,
          runEvents
        );
      });
    },
  };

  /**
   *
   * @param $element - инпут
   * @param toCount - передаваемое первоначальное значение, куда тыкать
   * @param percentage - проценты
   * @param important - запустить в любом случае
   * @param viewChangeOnEnd - закончено ли действи
   * @param runEvents - запускать событие?
   * @param inputTypeScroll - тип действия. 0 - click, 1 - scroll, 2 - changeValue
   * @returns {boolean}
   */
  function setTo(
    $element,
    toCount,
    percentage = false,
    important = false,
    viewChangeOnEnd = true,
    runEvents = true,
    inputTypeScroll = 0
  ) {
    let config = getConfig($element);

    if ($element.val() === "" || toCount === "") {
      toCount = config.lastInput;
    }

    if (!validateInput(toCount) && $element.val() !== "") {
      $element.val(config.current);
      return false;
    }

    let toCountTransform = getTransformValue(
      toCount,
      percentage,
      config.settings.min,
      config.settings.max,
      config.settings.startNumbStepping,
      config.settings.step,
      config.settings.stepRoundOnInput,
      inputTypeScroll
    );

    if (toCountTransform.value === config.current) {
      runEvents = false;
    }

    if (runEvents) {
      callCallbackConfig("onChange", config);
      generateEvents(
        config.self[0],
        "inputSliderRange_change",
        generateOutputInfoToEvent(config)
      );
    }

    if (!viewChangeOnEnd) {
      viewChangePosition(config, toCount);
    } else {
      important = true;
    }

    if (config.currentOld !== toCountTransform.valueRaw || important) {
      doProcess();

      if (runEvents) {
        if (config.settings.delay < 50) {
          runOnChanged(config);
        } else {
          clearTimeout(config.timer);
          config.timer = setTimeout(() => {
            runOnChanged(config);
          }, config.settings.delay);
        }
      }
    }

    function runOnChanged(config) {
      callCallbackConfig("onChanged", config);
      generateEvents(
        config.self[0],
        "inputSliderRange_changed",
        generateOutputInfoToEvent(config)
      );
    }

    function doProcess() {
      config.currentPercentage = toCountTransform.percent;
      config.currentOld = config.current;
      config.current = toCountTransform.value;
      config.lastInput = config.current;

      if (viewChangeOnEnd) {
        changePosition(config);
      }

      config.self.val(thousandSeparator(config.current));
    }
  }

  function getTransformValue(
    toCount,
    percentage,
    min,
    max,
    startNumbStepping,
    step,
    stepRoundOnInput,
    inputTypeScroll
  ) {
    if (typeof step === "object") {
      return transformValueWithProportionSteps(...arguments);
    }

    let stepNew = {};
    stepNew[min] = step;

    return transformValueWithProportionSteps(
      toCount,
      percentage,
      min,
      max,
      startNumbStepping,
      stepNew,
      stepRoundOnInput,
      inputTypeScroll
    );
  }

  function transformValueWithProportionSteps(
    toCount,
    percentage,
    min,
    max,
    startNumbStepping,
    step,
    stepRoundOnInput,
    inputTypeScroll,
    roundSize = 0
  ) {
    step = getValidSteps(step, min, max);

    const outputPackage = (percentRaw, valueRaw, percent, value) => ({
      percentRaw,
      valueRaw,
      percent,
      value,
    });

    toCount = parseFloat(toCount);

    let rawValue, percent;

    if (percentage) {
      percent = validatePercent(toCount);
      rawValue = findRawValueByPercentInLineSegment(percent, min, max, step);
    } else {
      rawValue = parseFloat(validateValue(toCount, min, max));
    }

    rawValue = parseFloat(rawValue.toFixed(roundSize));

    if (inputTypeScroll === 1 || inputTypeScroll === 0) {
      stepRoundOnInput = true;
    }

    let rawPercent = getPercentByValueInLineSegment(rawValue, step, min, max);

    if (stepRoundOnInput) {
      let mostAppropriateValue = findMostAppropriateValueWithStepsInLineSegment(
        rawValue,
        step,
        min,
        max,
        startNumbStepping
      ),
        mostAppropriatePercent = getPercentByValueInLineSegment(
          mostAppropriateValue,
          step,
          min,
          max
        );

      return outputPackage(
        rawPercent,
        rawValue,
        mostAppropriatePercent,
        mostAppropriateValue
      );
    }

    return outputPackage(rawPercent, rawValue, rawPercent, rawValue);
  }

  const checkDisabledConfigAndSet = ($input, settings) => {
    let config = getConfig($input);
    config.disabled = settings.disabled;
    setDisabled(config.elements.parent, $input, settings.disabled);
  };

  const setDisabled = ($wrapper, $input, visible) => {
    if (!visible) {
      $wrapper.removeClass("InputSliderRange_disabled");
      $input.prop("disabled", false);
    } else {
      $wrapper.addClass("InputSliderRange_disabled");
      $input.prop("disabled", true);
    }
  };

  const findMostAppropriateValueWithStepsInLineSegment = (
    value,
    steps,
    start,
    end,
    startCount
  ) => {
    let currentSegment = getNumbSegmentByValue(value, steps),
      neighbors = findLeftAndRightNeighborByValue(
        value,
        startCount,
        start,
        end,
        steps,
        currentSegment
      );

    return value - neighbors.left >= neighbors.right - value
      ? neighbors.right
      : neighbors.left;
  };

  const findLeftAndRightNeighborByValue = (
    value,
    startCount,
    start,
    end,
    steps,
    currentSegment
  ) => {
    let bordersSegment = getMaxAndMinCurrentLineSegment(
      steps,
      start,
      end,
      currentSegment
    ),
      startToCount = bordersSegment.min;

    if (currentSegment === 0 && startCount < bordersSegment.min) {
      startToCount = startCount;
    }

    let currentStep = Object.values(steps)[currentSegment],
      countStepsInSegment = getCountStepsInLineSegment(
        startToCount,
        bordersSegment.min,
        bordersSegment.max,
        currentStep
      ),
      leftNeighbor,
      rightNeighbor,
      firstStep = bordersSegment.min + countStepsInSegment.first;

    if (value < firstStep) {
      leftNeighbor = bordersSegment.min;
    } else if (value < firstStep + currentStep) {
      leftNeighbor = firstStep;
    } else {
      let diff = (value - firstStep) % currentStep;
      leftNeighbor = value - diff;
    }

    rightNeighbor = leftNeighbor + currentStep;

    if (rightNeighbor > bordersSegment.max) {
      rightNeighbor = bordersSegment.max;
    }

    return {
      left: leftNeighbor,
      right: rightNeighbor,
    };
  };

  const getPercentByValueInLineSegment = (value, steps, start, end) => {
    let numbStep = getNumbSegmentByValue(value, steps),
      keys = Object.keys(steps),
      keysLength = keys.length;

    let bordersSegment = getMaxAndMinCurrentLineSegment(
      steps,
      start,
      end,
      numbStep
    ),
      percentCalcInSegment =
        (value - bordersSegment.min) /
        ((bordersSegment.max - bordersSegment.min) / 100),
      plusPercents = calcStartSegmentPlusPercents(numbStep, keysLength);

    return plusPercents + percentCalcInSegment / keysLength;
  };

  const getValidSteps = (steps, start, end) => {
    let rev = [],
      retObject = {};

    let reverseArraySteps = Object.entries(steps).reverse();

    reverseArraySteps.every((arrWithKeys) => {
      let [border, step] = arrWithKeys,
        borderValue = parseFloat(border);

      if (borderValue > start) {
        rev.push([borderValue, step]);
        return true;
      }
      rev.push([start, step]);
      return false;
    });

    rev = rev.filter((value) => {
      const [border] = value;
      return border <= end;
    });

    rev.reverse().forEach((arrValue) => {
      retObject[arrValue[0]] = arrValue[1];
    });

    return retObject;
  };

  const getNumbSegmentByValue = (value, steps) => {
    let numbStep = 0;

    Object.keys(steps)
      .reverse()
      .some((valueStep, index, arr) => {
        if (value < valueStep) {
          return false;
        }
        numbStep = arr.length - index - 1;
        return true;
      });

    return numbStep;
  };

  const calcStartSegmentPlusPercents = (numbSegment, quantitySegments) => {
    return (100 / quantitySegments) * numbSegment;
  };

  const findRawValueByPercentInLineSegment = (percent, start, end, steps) => {
    let valuesStepsLength = Object.values(steps).length;
    let numbSegment = checkByPercentNumbLineSegment(percent, valuesStepsLength);
    let percentInLineSegment = getPercentInCurrentLineSegment(
      percent,
      numbSegment,
      valuesStepsLength
    );
    let bordersSegment = getMaxAndMinCurrentLineSegment(
      steps,
      start,
      end,
      numbSegment
    );

    return calcValueInSegment(
      percentInLineSegment,
      bordersSegment.min,
      bordersSegment.max
    );
  };

  const calcValueInSegment = (percent, minValue, maxValue) => {
    return minValue + percent * ((maxValue - minValue) / 100);
  };

  const getMaxAndMinCurrentLineSegment = (steps, start, end, numbSegment) => {
    let keys = Object.keys(steps),
      valuesSteps = Object.values(steps),
      lengthSegment = valuesSteps.length,
      min = keys[numbSegment],
      max;

    if (min < start) {
      min = start;
    }

    if (numbSegment < lengthSegment - 1) {
      max = keys[numbSegment + 1];
    } else {
      max = end;
    }

    return {
      min: parseFloat(min),
      max: parseFloat(max),
    };
  };

  const getPercentInCurrentLineSegment = (
    percentOnAllLine,
    numbSegment,
    quantitySegments
  ) => {
    let percentOnSegment = getPercentInLineSegment(
      percentOnAllLine,
      numbSegment,
      quantitySegments
    );
    return percentOnSegment * quantitySegments;
  };

  const getPercentInLineSegment = (percent, numbSegment, quantitySegments) => {
    return percent - (100 / quantitySegments) * numbSegment;
  };

  const checkByPercentNumbLineSegment = (percent, quantitySegments) => {
    if (percent >= 100) {
      return quantitySegments - 1;
    }
    return Math.floor(percent / (100 / quantitySegments));
  };

  const getCountStepsInLineSegment = (startCount, start, end, stepSize) => {
    let counter = 0,
      diffStart = (start - startCount) % stepSize,
      first = stepSize,
      last = stepSize;

    if (startCount < start && diffStart !== 0) {
      counter += 1;
      first = stepSize - diffStart;
      start += first;
    }

    let ceilPart = Math.floor((end - start) / stepSize),
      onEnd = end - (start + ceilPart * stepSize);

    counter += ceilPart;

    if (onEnd > 0) {
      counter += 1;
      last = onEnd;
    }

    return {
      first,
      last,
      counter,
      step: stepSize,
    };
  };

  function toggleGridInwardly(config) {
    if (config.settings.gridInwardly) {
      config.elements.parent.addClass("InputSliderRange_grid_inwardly");
    } else {
      config.elements.parent.addClass("InputSliderRange_grid_inwardly");
    }
  }

  function getConfigFromAttr($element) {
    let attributesName = ["min", "max", "step", "theme"],
      objectFormAttr = {};

    attributesName.forEach((attributeName) => {
      let valueAttribute = $element.data(`isr-${attributeName}`);
      if (typeof valueAttribute !== "undefined") {
        objectFormAttr[attributeName] = valueAttribute;
      }
    });

    return objectFormAttr;
  }

  function is_touch_device() {
    return (
      "ontouchstart" in window ||
      navigator.MaxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  function validateValue(value, min, max) {
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }

  function validatePercent(percent) {
    if (percent < 0) {
      return 0;
    }
    if (percent > 100) {
      return 100;
    }
    return percent;
  }

  function changePosition(config) {
    viewChangePosition(config, config.currentPercentage);
  }

  function viewChangePosition(config, size) {
    let sizeText = size + "%";

    config.elements.handler.css("left", sizeText);
    config.elements.fill.css("width", sizeText);
  }

  function calculateCurrentValue(numb, min, max) {
    if (numb >= min && numb <= max) {
      return numb;
    } else {
      return numb < min ? min : max;
    }
  }

  function validateInput(text) {
    let decimal = /^[+-]?\d+(\.\d+)?$/;
    return !(("" + text).match(decimal) === null);
  }
});


document.getElementById("series") &&
  IMask(document.getElementById("series"), {
    mask: "0000 000000",
    definitions: {
      X: {
        mask: "0",
        displayChar: "X",
        placeholderChar: "_",
      },
    },
    lazy: true,
    overwrite: "shift",
  });

document.getElementById("subdivision") &&
  IMask(document.getElementById("subdivision"), {
    mask: "000 000",
    definitions: {
      X: {
        mask: "0",
        displayChar: "X",
        placeholderChar: "_",
      },
    },
    lazy: true,
    overwrite: "shift",
  });

Object.assign(Datepicker.locales, ru);

const elemPas = document.querySelector('input[name="date"]');
// const datepickerPas = new Datepicker(elemPas, {
//   language: "ru",
//   format: "dd.mm.yyyy",
//   showOnFocus: false,
//   showOnClick: false,
//   autohide: true,
// });
document.getElementById("date-mask") &&
  IMask(document.getElementById("date-mask"), {
    mask: Date,
    lazy: false,
    blocks: {
      d: {
        mask: IMask.MaskedRange,
        placeholderChar: "Д",
        from: 1,
        to: 31,
        maxLength: 2,
      },
      m: {
        mask: IMask.MaskedRange,
        placeholderChar: "М",
        from: 1,
        to: 12,
        maxLength: 2,
      },

      Y: {
        mask: IMask.MaskedRange,
        max: 2000,
        placeholderChar: "Г",
        from: 1900,
        to: new Date().getFullYear(),
        maxLength: 4,

        // validate: (value) => {
        //   if (value.length === 1 && value !== "1" && value !== "2") {
        //     return false;
        //   }
        // },
      },
    },
    validate: (value, masked) => {
      if (value.length === 10) {
        clearError("#date");
      }
      // console.log(masked);
    },
  });
elemPas.addEventListener("changeDate", (event) => {
  clearError("#date");
});

$("#address").suggestions({
  token: "7cabccd0c7d471b01ef1c698155034c049825d9a",
  type: "ADDRESS",
  /* Вызывается, когда пользователь выбирает одну из подсказок */
  onSelect: function (suggestion) {
    console.log(suggestion);
  }
});

$("#party").suggestions({
  token: "7cabccd0c7d471b01ef1c698155034c049825d9a",
  type: "PARTY",
  /* Вызывается, когда пользователь выбирает одну из подсказок */
  onSelect: function (suggestion) {
    console.log(suggestion);
  }
});