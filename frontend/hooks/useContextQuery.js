import { useContext } from 'react';
// contexts
import { AccountContext } from '../components/accessControl/AccountContext';
import { PatientContext } from '../components/context/PatientContext';
// 3rd-party-lib
import merge from 'lodash/merge';
import { useQuery } from '@apollo/react-hooks';

const useContextQuery = (query, options = {}, dependencies = [], propertyNames = {}) => {
  const { data } = useContext(AccountContext) || {};
  const { currentPatient } = useContext(PatientContext) || {};
  const selectedClinic = data?.selectedClinic || null;
  const client = data?.client?.id || null;
  const patient = currentPatient?.id || null;
  const clinic = selectedClinic?.id || null;

  let defaultPropertyNames = { client: 'client_id', clinic: 'clinic_id', patient: 'patient_id' };
  propertyNames = merge(defaultPropertyNames, propertyNames);
  const variables = { client, patient, clinic };

  let defaultVariables = {};

  const supportedDependencies = ['client', 'clinic', 'patient'];
  if (dependencies.length > 0) {
    // check the dependencies don't accept unsupported deps
    dependencies.forEach((value) => {
      if (!supportedDependencies.includes(value)) {
        throw new Error(
          `We don't support this dependency, Please remove it from deps array: ${value}`,
        );
      } else {
        defaultVariables[propertyNames[value]] = variables[value];
      }
    });
    // create the default variables
  } else {
    throw new Error('Dependency array must not be empty');
  }

  options.variables = merge(options.variables, defaultVariables);

  const queryResult = useQuery(query, options);

  return queryResult;
};

export default useContextQuery;
