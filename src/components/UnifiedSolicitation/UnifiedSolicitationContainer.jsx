import React, { Component } from "react";
import { getSchools } from "../../services/school.service";
import { getReasons } from "../../services/foodInclusion.service";
import { getWorkingDays } from "../../services/workingDays.service";
import UnifiedSolicitation from "./UnifiedSolicitation";

class UnifiedSolicitationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enrolled: 4500,
      two_working_days: null,
      five_working_days: null,
      reasons_simple: [],
      reasons_continuous_program: [],
      schools: []
    };
  }

  componentDidMount() {
    getSchools().then(res => {
      getReasons().then(resReasons => {
        getWorkingDays().then(resWD => {
          let schools = res.slice(0, 50);
          schools.forEach(function(school) {
            school["id"] = school["_id"].toString();
            school["burger_active"] = false;
            school["limit_of_meal_kits"] = 0;
            school["number_of_choices"] = 0;
            school["number_of_meal_kits"] = 0;
            school["nro_alunos"] = 0;
            school["numero_alunos"] = 0;
            school["tempo_passeio"] = null;
            school["kit_lanche"] = null;
            school["checked"] = false;
          });
          let _two,
            _five = null;
          _two = resWD[0].date_two_working_days.split("/");
          _five = resWD[0].date_five_working_days.split("/");
          this.setState({
            ...this.state,
            reasons_simple: resReasons.content.reasons_simple,
            reasons_continuous_program:
              resReasons.content.reasons_continuous_program,
            two_working_days: new Date(_two[2], _two[1] - 1, _two[0]),
            five_working_days: new Date(_five[2], _five[1] - 1, _five[0]),
            schools: schools
          });
        });
      });
    });
  }

  render() {
    return <UnifiedSolicitation {...this.state} />;
  }
}

export default UnifiedSolicitationContainer;
