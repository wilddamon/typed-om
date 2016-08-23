// Copyright 2015 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License.

(function(internal, scope) {

  function computeMatrix(cssTranslation) {
    // CSSTranslation is represented by the identity matrix with the translation
    // values down the last column.
    // See documentation https://drafts.csswg.org/css-transforms-1/.
    var matrix;
    if (cssTranslation.z == null) {
      matrix = new DOMMatrixReadonly(
          [1, 0, 0, 1, cssTranslation.x.value, cssTranslation.y.value]);
    } else {
      matrix = new DOMMatrixReadonly(
          [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, cssTranslation.x.value,
          cssTranslation.y.value, cssTranslation.z.value, 1]);
    }
    return matrix;
  };

  function generateCssString(cssTranslation) {
    switch (cssTranslation._inputType) {
      case '1':
        return 'translate(' + cssTranslation.x.cssText + ')';
      case '2':
        return 'translate(' + cssTranslation.x.cssText + ', ' + cssTranslation.y.cssText + ')';
      case '3':
        return 'translate3d('
          + cssTranslation.x.cssText + ', '
          + cssTranslation.y.cssText + ', '
          + cssTranslation.z.cssText + ')';
      case 'x':
        return 'translatex(' + cssTranslation.x.cssText + ')';
      case 'y':
        return 'translatey(' + cssTranslation.y.cssText + ')';
      case 'z':
        return 'translatez(' + cssTranslation.z.cssText + ')';
    }
  };

  function CSSTranslation(x, y, z) {
    if (arguments.length != 2 && arguments.length != 3) {
      throw new TypeError('CSSTranslation takes 2 or 3 arguments.');
    }

    for (var i = 0; i < arguments.length; i++) {
      if (!(arguments[i] instanceof CSSSimpleLength) ||
          arguments[i].type != internal.CSSLengthTypes.PX) {
        throw new TypeError('Unsupported argument for CSSTranslation. Only ' +
            'CSSSimpleLength instances with type \'px\' are supported.');
      }
    }

    this.x = new CSSSimpleLength(x);
    this.y = new CSSSimpleLength(y);
    if (z instanceof CSSSimpleLength) {
      this.z = new CSSSimpleLength(z);
      this._inputType = '3';
    } else {
      this.z = null;
      this._inputType = '2';
    }

    this.matrix = computeMatrix(this);
    this.is2D = this.matrix.is2D;

    Object.defineProperty(this, 'cssText', {
      get: function() {
        if (!this._cssText) {
          this._cssText = generateCssString(this);
        }
        return this._cssText;
      },
      set: function(newCssText) {}
    });
  }
  internal.inherit(CSSTranslation, internal.CSSTransformComponent);

  scope.CSSTranslation = CSSTranslation;

})(typedOM.internal, window);
