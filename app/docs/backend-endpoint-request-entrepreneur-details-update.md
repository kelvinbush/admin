# Backend Endpoint Request: Update Entrepreneur Details (Consolidated)

## Problem Statement

Currently, the Entrepreneur Details form (`/entrepreneurs/[id]/entrepreneur-details`) requires **two separate API calls** to update all fields:

1. **First call**: `PUT /admin/sme/onboarding/{userId}/step/1` - Updates core user information (email, firstName, lastName, phone, dob, gender, position)
2. **Second call**: `PUT /admin/sme/onboarding/{userId}/step/4` - Updates user metadata fields (idNumber, taxNumber, idType) stored in the users table

**Note**: All fields are stored in the **users table** - `idNumber`, `taxNumber`, and `idType` are simple user metadata fields and are **not linked to the documents table**.

This approach is inefficient and creates potential race conditions. We need a **single consolidated endpoint** that can update all entrepreneur personal details in one atomic operation.

---

## Proposed Endpoint

### Endpoint Details

- **Method**: `PUT`
- **Path**: `/admin/sme/users/{userId}/details`
- **Description**: Update entrepreneur personal details including core user info and user metadata fields (idNumber, taxNumber, idType) in a single request. All fields are stored in the users table.

---

## Request Body Schema

```typescript
interface UpdateEntrepreneurDetailsRequest {
  // Core user information (from Step 1)
  email: string;                    // Required, must be valid email
  firstName: string;                 // Required
  lastName: string;                  // Required
  phone: string;                     // Optional, but typically provided
  dob?: string;                      // Optional, ISO date format: YYYY-MM-DD
  gender: string;                    // Required, one of: "male", "female", "other"
  position?: string;                 // Optional, position held (e.g., "founder", "executive", "senior", or custom string)

  // User metadata fields (stored in users table)
  idNumber?: string;                 // Optional, identification document number
  taxNumber?: string;                 // Optional, tax identification number
  idType?: string;                   // Optional, type of ID (e.g., "national_id", "passport")
}
```

### Field Details

| Field | Type | Required | Description | Notes |
|-------|------|----------|-------------|-------|
| `email` | string | Yes | User's email address | Must be valid email format |
| `firstName` | string | Yes | User's first name | Min length: 1 |
| `lastName` | string | Yes | User's last name | Min length: 1 |
| `phone` | string | No | User's phone number | International format supported |
| `dob` | string | No | Date of birth | ISO format: `YYYY-MM-DD` |
| `gender` | string | Yes | User's gender | Values: `"male"`, `"female"`, `"other"` |
| `position` | string | No | Position held | Can be predefined value or custom string |
| `idNumber` | string | No | Identification document number | National ID, passport number, etc. |
| `taxNumber` | string | No | Tax identification number | Business/personal tax ID |
| `idType` | string | No | Type of identification document | e.g., `"national_id"`, `"passport"` |

---

## Response Schema

```typescript
interface UpdateEntrepreneurDetailsResponse {
  userId: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    dob?: string;
    gender: string;
    position?: string;
    idNumber?: string | null;
    taxNumber?: string | null;
    idType?: string | null;
    onboardingStatus: string;
  };
}
```

**OR** return the full `SMEUserDetail` object (consistent with existing endpoints):

```typescript
interface SMEUserDetail {
  userId: string;
  currentStep: number;
  completedSteps: number[];
  user: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    dob?: string;
    gender?: string;
    position?: string;
    onboardingStatus: string;
    idNumber?: string | null;
    taxNumber?: string | null;
    idType?: string | null;
  };
  business: {
    // ... business fields
  };
}
```

---

## Business Logic Requirements

1. **Atomic Operation**: All fields should be updated in a single database transaction on the **users table**. If any field fails validation, the entire operation should be rolled back.

2. **User Table Fields**: All fields (`idNumber`, `taxNumber`, `idType`, and core user info) are stored directly in the **users table**. These are simple metadata fields and are **not linked to the documents table**.

3. **Validation**:
   - Email must be valid format and unique (if changed)
   - `firstName` and `lastName` are required and cannot be empty
   - `gender` must be one of the allowed values
   - `dob` must be a valid date in the past (not future dates)
   - If `idNumber` is provided, `idType` should ideally be inferred or defaulted (but can be explicitly set)

4. **Backward Compatibility**: This endpoint should not break existing Step 1 or Step 4 endpoints. They should continue to work independently for onboarding flows.

---

## Example Request

```json
PUT /admin/sme/users/123e4567-e89b-12d3-a456-426614174000/details

{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678",
  "dob": "1990-05-15",
  "gender": "male",
  "position": "founder",
  "idNumber": "12345678",
  "taxNumber": "TAX-98765432",
  "idType": "national_id"
}
```

## Example Response

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "user": {
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+254712345678",
    "dob": "1990-05-15",
    "gender": "male",
    "position": "founder",
    "idNumber": "12345678",
    "taxNumber": "TAX-98765432",
    "idType": "national_id",
    "onboardingStatus": "active"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "firstName": "First name is required"
  }
}
```

### 404 Not Found
```json
{
  "error": "User not found",
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

### 409 Conflict
```json
{
  "error": "Email already exists",
  "email": "john.doe@example.com"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Failed to update user details"
}
```

---

## Current Implementation Context

### Current Flow (Inefficient)
```typescript
// First API call
await updateUserMutation.mutateAsync({
  userId,
  data: {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phoneNumber || "",
    dob,
    gender: data.gender,
    position: position || "",
  },
});

// Second API call (only if idNumber/taxNumber/idType provided)
// Note: Step 4 endpoint currently accepts these fields, but they're just user table fields
if (idNumber || taxNumber || idType) {
  await savePersonalDocsMutation.mutateAsync({
    userId,
    data: {
      documents: [],  // Empty array since we're only updating user metadata
      ...(idNumber && { idNumber }),
      ...(taxNumber && { taxNumber }),
      ...(idType && { idType }),
    },
  });
}
```

### Proposed Flow (Efficient)
```typescript
// Single API call
await updateEntrepreneurDetailsMutation.mutateAsync({
  userId,
  data: {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phoneNumber || "",
    dob,
    gender: data.gender,
    position: position || "",
    idNumber: data.identificationNumber || undefined,
    taxNumber: data.taxIdentificationNumber || undefined,
    idType: idType || undefined,
  },
});
```

---

## Benefits

1. **Performance**: Single API call reduces network overhead and latency
2. **Atomicity**: All updates happen in one transaction, preventing partial updates
3. **Simplified Frontend**: No need to manage sequential API calls and error handling
4. **Better UX**: Faster response time for users
5. **Consistency**: Ensures all related fields are updated together

---

## Questions for Backend Team

1. Should we maintain backward compatibility with Step 1 and Step 4 endpoints, or deprecate them?
2. What validation rules should apply to `idNumber` and `taxNumber` (format, length, uniqueness)?
3. Should `idType` be required when `idNumber` is provided?
4. Should email changes trigger any additional workflows (e.g., verification email)?
5. Are there any constraints on updating these fields (e.g., can they be updated after onboarding is complete)?

---

## Priority

**High** - This is blocking optimal UX in the entrepreneur details edit form.

---

## Contact

For questions or clarifications, please reach out to the frontend team.

